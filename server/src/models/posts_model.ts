import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IPost {
  title: string;
  content: string;
  owner: string;
  picture: string;
  likes: string[]; // Updated to be an array of strings
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
  likes: {
    type: [String],
    default: [],
  },
});

const postModel = mongoose.model<IPost>("Posts", postSchema);

export default postModel;