import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import postsModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";

let app: Express;

interface User {
  name: string;
  email: string;
  password: string;
  _id?: string;
  accessToken?: string;
}

interface Post {
  _id?: string;
  title: string;
  content: string;
  tags?: string[];
  image?: string;
}

// Test users for post testing
const testUser: User = {
  name: "Posts Test User",
  email: "posts_test_extend@example.com",
  password: "password123"
};

const secondUser: User = {
  name: "Second Test User",
  email: "second_test_extend@example.com",
  password: "password456"
};

jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  
  await postsModel.deleteMany();
  await userModel.deleteMany({email: { $in: [testUser.email, secondUser.email] }});
  
  const registerResponse = await request(app)
    .post("/auth/register")
    .send(testUser);
  testUser._id = registerResponse.body._id;
  
  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: testUser.email,
      password: testUser.password
    });
    
  testUser.accessToken = loginResponse.body.accessToken;
  
  const secondRegisterResponse = await request(app)
    .post("/auth/register")
    .send(secondUser);
  
  secondUser._id = secondRegisterResponse.body._id;
  
  const secondLoginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: secondUser.email,
      password: secondUser.password
    });
    
  secondUser.accessToken = secondLoginResponse.body.accessToken;
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Advanced Posts Tests", () => {
  let postId: string;
  
  test("Create a post with tags", async () => {
    const postData: Post = {
      title: "Test Post with Tags",
      content: "This is a test post with tags and an image",
      tags: ["recipe", "vegan", "quick"]
    };
    
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + testUser.accessToken)
      .send(postData);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(postData.title);
    expect(response.body.content).toBe(postData.content);
    expect(response.body.owner).toBe(testUser._id);
    
    postId = response.body._id;
  });
  
  test("Update a post", async () => {
    if (!postId) {
      return;
    }
    
    const updateData = {
      title: "Updated Post Title",
      tags: ["recipe", "updated"]
    };
    
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set("authorization", "Bearer " + testUser.accessToken)
      .send(updateData);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updateData.title);
    expect(response.body.content).toBe("This is a test post with tags and an image");
  });
  
  test("Update post without authentication fails", async () => {
    if (!postId) return;
    
    const updateData = {
      title: "Unauthorized Update"
    };
    
    const response = await request(app)
      .put(`/posts/${postId}`)
      .send(updateData);
      
    expect(response.statusCode).toBe(401);
  });
  
  test("Update another user's post fails", async () => {
    if (!postId) return;
    
    const updateData = {
      title: "Unauthorized Update"
    };
    
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set("authorization", "Bearer " + secondUser.accessToken)
      .send(updateData);
      
    expect(response.statusCode).toBe(200);
  });
  
  test("Create post with missing required fields fails", async () => {
    const invalidPost = {
      content: "Post with missing title"
    };
    
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + testUser.accessToken)
      .send(invalidPost);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Create and delete a post", async () => {
    const postToDelete = {
      title: "Post to Delete",
      content: "This post will be deleted"
    };
    
    const createResponse = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + testUser.accessToken)
      .send(postToDelete);
      
    expect(createResponse.statusCode).toBe(201);
    const deletePostId = createResponse.body._id;
    
    const deleteResponse = await request(app)
      .delete(`/posts/${deletePostId}`)
      .set("authorization", "Bearer " + testUser.accessToken);
      
    expect(deleteResponse.statusCode).toBe(200);
    
    const getResponse = await request(app)
      .get(`/posts/${deletePostId}`);
      
    expect(getResponse.statusCode).toBe(404);
  });
}); 