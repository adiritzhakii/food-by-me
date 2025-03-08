import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import { GoogleGenerativeAI } from "@google/generative-ai"

// const PREFIX_PROMPT = "Hey this is a site for food recommendation i am going \
//                        to bring you task to generate post for the site, \
//                        please if the taks is not clear return to me that the request is not clear\
//                        and please dont write more than 50 words. the task is - "
const PREFIX_PROMPT = "You are a passionate food blogger writing engaging and sensory-rich posts about homemade dishes. The user will provide the name of the dish they made, and you will expand on it with a vivid description, backstory, ingredients, and how it was made. Maintain a warm, inviting, and personal tone. Make the reader feel like they can almost taste and smell the dish. End with a fun suggestion, such as a perfect side dish or a pairing recommendation."
const port = process.env.PORT;
const AI_API = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(AI_API as string);

class PostController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        const postImage = req.params.imagePath;
        const post :IPost= {
            ...req.body,
            owner: userId,
            picture: `http://localhost:${port}/api/public/${postImage}`,
            likes: 0,
        }
        req.body = post;
        super.create(req, res);
    };

    async genAIPost(req: Request, res: Response) {
        
        try{
            const { prompt } = req.body;
            const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
            const result = await model.generateContent(PREFIX_PROMPT + prompt);
            const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
            res.json({text})
        }catch (error) {
            console.log("Error generating text: ", error)
            res.status(500).json({error: "Error generating text"});
        }
    }
}

export default new PostController();
