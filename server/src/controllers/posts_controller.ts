import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

const port = process.env.PORT;

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
}

export default new PostController();
