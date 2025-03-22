import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentsModel, { IComments } from "../models/comments_model";
import postModel, { IPost } from '../models/posts_model'
import testPostsData from './test_posts.json'
import testCommentsData from "./test_comments.json";
import { Express } from "express";
import testUserData from "./test_users.json";
import userModel from "../models/user_model";

let app: Express;

interface Comment {
  _id?: string;
  owner?: string;
  postId: string;
  comment: string
}

const CommentsData: Comment[] = testCommentsData;

const baseUrl = "/comments";

interface IPostDB extends IPost {
  _id: string;
}

interface User {
  _id: string;
  accessToken: string;
  refreshToken: string;
}

const loginNewUser = async (userSampleIndex: number): Promise<User> => {
  await request(app).post("/auth/register").send(testUserData[userSampleIndex])
  const loginResponse = await request(app).post("/auth/login").send(testUserData[userSampleIndex]);
  return loginResponse.body;
}

const createNewPost = async (accessToken: string): Promise<IPostDB> => {
  const postResponse = await request(app).post("/posts").
    set("authorization", "JWT " + accessToken).send(testPostsData[0])
  return postResponse.body;
}

jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  await commentsModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Comments Test", () => {
  test("Test get all comments empty", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test create new comment", async () => {
    const {_id: userId, accessToken} = await loginNewUser(0)
    const { _id: postId } = await createNewPost(accessToken)
    for (let comment of CommentsData) {
      const response = await request(app).post(baseUrl).
      set("authorization", "JWT " + accessToken).send({...comment, postId});
      expect(response.statusCode).toBe(201);
      expect(response.body.comment).toBe(comment.comment);
      expect(response.body.postId).toBe(postId);
      expect(response.body.owner).toBe(userId);
    }
  });

  test("Test get all comments", async () => {
    const response = await request(app).get(baseUrl);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(CommentsData.length);
  });

  test("Test get comment by id", async () => {
    const getAllResponse = await request(app).get(baseUrl);
    expect(getAllResponse.statusCode).toBe(200);
    expect(getAllResponse.body.length).toBe(CommentsData.length);

    const response = await request(app).get(baseUrl + "/" + getAllResponse.body[0]._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(getAllResponse.body[0]._id);
  });

  test("Test filter comments by owner", async () => {
    const { accessToken} = await loginNewUser(1)
    const { _id: postId } = await createNewPost(accessToken)
    await request(app).post(baseUrl).set("authorization", "JWT " + accessToken).
      send({...testCommentsData[0], postId});

    const getAllResponse = await request(app).get(baseUrl);
    expect(getAllResponse.body.length).toBe(3)
    
    const comment = getAllResponse.body[0];
    const response = await request(app).get(baseUrl + "?owner=" + comment.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete comment", async () => {
    const { accessToken } = await loginNewUser(1)
    const getAllResponse = await request(app).get(baseUrl);
    
    const {_id} = getAllResponse.body[0];
    const response = await request(app).delete(baseUrl + "/" + _id)
      .set("authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
    
    const responseGet = await request(app).get(baseUrl + "/" + _id);
    expect(responseGet.statusCode).toBe(404);
  });

  test("Test create new comment fail", async () => {
    const response = await request(app).post(baseUrl).send({
      comment: "Test comment"
    });
    expect(response.statusCode).toBe(401);
  });
});
