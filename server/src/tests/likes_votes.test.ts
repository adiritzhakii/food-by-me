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
  owner?: string;
  likes?: string[];
}

// Test users
const testUsers: User[] = [
  {
    name: "Likes User 1",
    email: "likes1@test.com",
    password: "1234567"
  },
  {
    name: "Likes User 2",
    email: "likes2@test.com",
    password: "7654321"
  },
  {
    name: "Likes User 3",
    email: "likes3@test.com",
    password: "abcdefg"
  }
];

jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  await postsModel.deleteMany();
  await userModel.deleteMany();
  
  // Register and login users
  for (let i = 0; i < testUsers.length; i++) {
    await request(app).post("/auth/register").send(testUsers[i]);
    const loginResponse = await request(app).post("/auth/login").send({
      email: testUsers[i].email,
      password: testUsers[i].password
    });
    testUsers[i]._id = loginResponse.body._id;
    testUsers[i].accessToken = loginResponse.body.accessToken;
  }
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Likes and Votes Tests", () => {
  const testPost: Post = {
    title: "Test Post for Likes",
    content: "This is a test post for testing likes functionality"
  };
  
  beforeAll(async () => {
    // Create test post
    const postResponse = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(testPost);
      
    testPost._id = postResponse.body._id;
    testPost.owner = postResponse.body.owner;
    testPost.likes = postResponse.body.likes || [];
  });
  
  test("User can like a post", async () => {
    const response = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .set("authorization", "JWT " + testUsers[1].accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toBeDefined();
    expect(response.body.likes.length).toBe(1);
    expect(response.body.likes.includes(testUsers[1]._id)).toBe(true);
  });
  
  test("User can like a post then unlike it", async () => {
    // Like post first
    let response = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .set("authorization", "JWT " + testUsers[2].accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.likes.length).toBe(2);
    expect(response.body.likes.includes(testUsers[2]._id)).toBe(true);
    
    // Then unlike
    response = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .set("authorization", "JWT " + testUsers[2].accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.likes.length).toBe(1);
    expect(response.body.likes.includes(testUsers[2]._id)).toBe(false);
  });
  
  test("Multiple users can like a post", async () => {
    // First user is already liking the post
    // Add second user
    const response = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .set("authorization", "JWT " + testUsers[2].accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.likes.length).toBe(2);
    expect(response.body.likes.includes(testUsers[1]._id)).toBe(true);
    expect(response.body.likes.includes(testUsers[2]._id)).toBe(true);
  });
  
  test("Get post shows correct likes", async () => {
    const response = await request(app)
      .get(`/posts/${testPost._id}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toBeDefined();
    expect(response.body.likes.length).toBe(2);
  });
  
  test("Like a post without authentication fails", async () => {
    const response = await request(app)
      .post(`/posts/${testPost._id}/like`);
      
    expect(response.statusCode).toBe(401);
  });
  
  test("Like count is preserved when post is updated", async () => {
    // Update the post
    const updateResponse = await request(app)
      .put(`/posts/${testPost._id}`)
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send({ title: "Updated Title" });
      
    expect(updateResponse.statusCode).toBe(200);
    
    // Check if likes are preserved
    const getResponse = await request(app)
      .get(`/posts/${testPost._id}`);
      
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.title).toBe("Updated Title");
    expect(getResponse.body.likes.length).toBe(2);
  });
  
  test("Likes are removed when post is deleted", async () => {
    // Create a new post to delete
    const newPost = {
      title: "Post to Delete",
      content: "This post will be deleted"
    };
    
    const createResponse = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(newPost);
      
    const postId = createResponse.body._id;
    
    // Add likes to the post
    await request(app)
      .post(`/posts/${postId}/like`)
      .set("authorization", "JWT " + testUsers[1].accessToken);
      
    // Delete the post
    const deleteResponse = await request(app)
      .delete(`/posts/${postId}`)
      .set("authorization", "JWT " + testUsers[0].accessToken);
      
    expect(deleteResponse.statusCode).toBe(200);
    
    // Try to get the deleted post
    const getResponse = await request(app)
      .get(`/posts/${postId}`);
      
    expect(getResponse.statusCode).toBe(404);
  });
}); 