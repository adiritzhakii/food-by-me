import commentsModel, { IComments } from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class CommentsController extends BaseController<IComments> {
    constructor() {
        super(commentsModel);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            if (!userId) {
                res.status(401).send("User ID not found");
                return;
            }
            
            const comment = {
                ...req.body,
                owner: userId,
            };
            
            // Create a new comment with the correct owner
            const newComment = await this.model.create(comment);
            res.status(201).send(newComment);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async getByPostId(req: Request, res: Response): Promise<void> {
        try {
          const { postId } = req.query;
          const comments = await commentsModel.find({ postId });
          res.json(comments);
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default new CommentsController();
