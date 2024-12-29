import commentsModel, { IComments } from "../models/comments_model";
import BaseController from "./base_controller";

const commentsController = new BaseController<IComments>(commentsModel);

export default commentsController;
