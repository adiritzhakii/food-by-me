import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PREFIX_PROMPT = "You are a passionate food blogger writing engaging and sensory-rich posts about homemade dishes.\
                       The user will provide the name of the dish they made, and you will expand on it with a vivid description,\
                       backstory, ingredients, and how it was made. Maintain a warm, inviting, and personal tone.\
                       Make the reader feel like they can almost taste and smell the dish. \
                       End with a fun suggestion, such as a perfect side dish or a pairing recommendation.\
                       Write Between 30-60 words. DO NOT pass this limit. \
                       Before finalizing your answer, please count the characters and make sure you are under the 30-60 words limit.\
                       Pay attention, if the input from the user is empty return response that the input is empty.\
                       if the input from the user is not about food, return response that the input is not about food.\
                       The input of the client is - ";
const port = process.env.PORT;
const AI_API = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(AI_API as string);

class PostController extends BaseController<IPost> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const postImage = req.params.imagePath;
        const post: IPost = {
            ...req.body,
            owner: userId,
            picture: `http://localhost:${port}/api/public/${postImage}`,
            likes: [],
        };
        req.body = post;
        super.create(req, res);
    }

    async genAIPost(req: Request, res: Response): Promise<void> {
        try {
            const { prompt } = req.body;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(PREFIX_PROMPT + prompt);
            const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
            res.json({ text });
        } catch (error) {
            console.log("Error generating text: ", error);
            res.status(500).json({ error: "Error generating text" });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { title, content } = req.body;
        const updateData: Partial<IPost> = { title, content };

        if (req.file) {
            const postImage = req.file.filename;
            updateData.picture = `http://localhost:${port}/api/public/${postImage}`;
        }

        console.log("Update data:", updateData);
        console.log("Item ID:", req.params.id);

        try {
            const updatedItem = await this.model.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedItem) {
                res.status(404).send("not found");
            }
            res.status(200).send(updatedItem);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async likePost(req: Request, res: Response): Promise<void> {
        const postId = req.params.id;
        const userId = req.params.userId;

        try {
            const post = await this.model.findById(postId);
            if (!post) {
                res.status(404).send("Post not found");
            }

            if (post?.likes.includes(userId)) {
                post.likes = post.likes.filter((id) => id !== userId);
            } else {
                post?.likes.push(userId);
            }

            await post?.save();
            res.status(200).send(post);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new PostController();