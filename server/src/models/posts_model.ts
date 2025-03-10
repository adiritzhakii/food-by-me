import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IPost {
  title: string;
  content: string;
  owner: string;
  picture: string;
  likes: number;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
  picture: String,
  likes: Number,
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;
