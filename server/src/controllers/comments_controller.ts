import commentsModel, { IComments } from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class CommentsController extends BaseController<IComments> {
    constructor() {
        super(commentsModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        const comment = {
            ...req.body,
            owner: userId,
        }
        req.body = comment;
        super.create(req, res);
    };

    async getByPostId(req: Request, res: Response) {
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
