
import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IOauthUser {
  _id?: string;
  email: string;
  googleId: string;
  name?: string;
  avatar?: string;
  refreshToken?: string[];
}

const UserOauthSchema = new Schema<IOauthUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    refreshToken: {
        type: [String],
        default: [],
    },
});


const UserOauthModel = mongoose.model<IOauthUser>("UserOauthModel", UserOauthSchema);

export default UserOauthModel;