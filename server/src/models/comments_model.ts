import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IComments {
  _id?: string;
  comment: string;
  owner: string;
  postId: string;
};

const commentsSchema = new Schema<IComments>({
  comment: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model<IComments>("Comments", commentsSchema);

export default commentModel;
