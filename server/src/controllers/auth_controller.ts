import { NextFunction, Request, Response } from 'express';
import userModel, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import {verifyGoogleToken} from '../utils/verifyGoogleToken'
import UserOauthModel, { IOauthUser } from '../models/oauth_user_model';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email: req.body.email,
            password: hashedPassword
        });
        res.status(200).send(user);
    } catch (err: any) {
        res.status(400).send("wrong email or password");
    }
};

const generateTokens = (user: IUser | IOauthUser): { accessToken: string, refreshToken: string } | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jwt.sign(
        {
            _id: user._id,
            random: random
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRE });

    const refreshToken = jwt.sign(
        {
            _id: user._id,
            random: random
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });

    if (user.refreshToken == null) {
        user.refreshToken = [];
    }
    user.refreshToken.push(refreshToken);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}

const login = async (req: Request, res: Response) => {
    try {
        //verify user & password
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send("wrong email or password");
            return;
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            res.status(400).send("wrong email or password");
            return;
        }
        //generate tokens
        const tokens = generateTokens(user);
        if (!tokens) {
            res.status(400).send("Access Denied");
            return;
        }
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
    } catch (err) {
        res.status(400).send("wrong email or password");
    }
};

type UserDocument = Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}

const verifyAccessToken = (refreshToken: string | undefined) => {
    return new Promise<UserDocument>((resolve, reject) => {
        if (!refreshToken) {
            reject("Access Denied");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject("Server Error");
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("Access Denied");
                return;
            }
            const userId = payload._id;
            try {
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("Access Denied");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject("Access Denied");
                    return;
                }
                user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
                resolve(user);
            } catch (err) {
                reject("Access Denied");
                return;
            }
        });
    });
};


const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyAccessToken(req.body.refreshToken);

        await user.save();

        res.status(200).send("Logged out");
    } catch (err) {
        res.status(400).send("Access Denied");
        return;
    }
};


const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyAccessToken(req.body.refreshToken);

        //generate new tokens
        const tokens = generateTokens(user);
        await user.save();

        if (!tokens) {
            res.status(400).send("Access Denied");
            return;
        }
        //send response
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (err) {
        res.status(400).send("Access Denied");
        return;
    }
};


type Payload = {
    _id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(" ")[1];
    if (!token) {
        res.status(401).send("Access Denied");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Server Error");
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send("Access Denied");
            return;
        }
        const userId = (payload as Payload)._id;
        req.params.userId = userId;
        next();
    });
};

export const registerOAuthHandler = async (req: Request, res: Response) => {
    const { credential } = req.body;
    try {
      // Verify the Google token
      const { email, name, googleId, avatar } = await verifyGoogleToken(credential);
      // Check if the user already exists
      let user = await UserOauthModel.findOne({ googleId });
  
      if (!user) {
        // If the user doesn't exist, create a new one
        user = new UserOauthModel({ email, name, googleId, avatar });
        await user.save();
        res.status(200).json({message: 'User registerd Successfully'});
      } else {
        console.log('registerOAuthHandler: Server internal error - User already registerd with that email');
        res.status(500).json({error: 'User already registerd with that email'});
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
      res.status(400).json({ error: 'Google OAuth failed' });
    }
  };

  export const loginOAuthHandler = async (req: Request, res: Response) => {
    const { credential } = req.body;
    try {
      // Verify the Google token
      const { googleId } = await verifyGoogleToken(credential);
      // Check if the user already exists
      let user = await UserOauthModel.findOne({ googleId });
  
      if (!user) {
        // If the user doesn't exist return error
        res.status(400).json({message: 'User is not registerd'});
      } else {
        // if user, generate tokens
        const tokens = generateTokens(user)
        if (!tokens){
            res.status(400).send('Access Denied in OAuth')
            return;
        }
        user.save();
        res.status(200).json(
            {
                user: user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
      }

    } catch (error) {
      console.error('Google OAuth failed:', error);
      res.status(400).json({ error: 'Google OAuth failed' });
    }
  };
  export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId: String = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        if (user === null) {
            res.status(404).send("Profile not found");
            return;
          } else {
            res.status(200).json({...user});
          }
    } catch (error) {
        res.status(400).send(error);
    }

  }

export default {
    register,
    login,
    logout,
    refresh,
    registerOAuthHandler,
    loginOAuthHandler,
    getProfile
};