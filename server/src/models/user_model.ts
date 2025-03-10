import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IUser {
  name: string;
  avatar: string;
  email: string;
  password: string;
  _id?: string;
  refreshToken?: string[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: [String],
    default: [],
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
