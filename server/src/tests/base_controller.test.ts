import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import postsModel from "../models/posts_model";
import userModel from "../models/user_model";

let app: Express;

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  console.log("Before all base controller tests");
  app = await appInit();
  await postsModel.deleteMany();
  await userModel.deleteMany();
});

afterAll(() => {
  console.log("After all base controller tests");
  mongoose.connection.close();
});

describe("Base Controller Test", () => {
  const testUser = {
    name: "Base Controller User",
    email: "basecontroller@test.com",
    password: "password123"
  };
  
  let userCredentials = {
    accessToken: "",
    userId: ""
  };
  
  let postId = "";
  
  test("Setup - Register and login user", async () => {
    // Register user
    const registerResponse = await request(app)
      .post("/auth/register")
      .send(testUser);
      
    expect(registerResponse.statusCode).toBe(200);
    
    // Login to get token
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
      
    expect(loginResponse.statusCode).toBe(200);
    userCredentials.accessToken = loginResponse.body.accessToken;
    userCredentials.userId = loginResponse.body._id;
  });
  
  test("Create - Should create a new post", async () => {
    const testPost = {
      title: "Test Base Controller Post",
      content: "This is a test post for the base controller",
      owner: userCredentials.userId
    };
    
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userCredentials.accessToken)
      .send(testPost);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    
    postId = response.body._id;
  });
  
  test("Create - Should handle validation errors", async () => {
    const invalidPost = {
      // Missing required fields
      owner: userCredentials.userId
    };
    
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userCredentials.accessToken)
      .send(invalidPost);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("GetAll - Should return all posts", async () => {
    const response = await request(app)
      .get("/posts")
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  test("GetAll - Should filter by owner", async () => {
    const response = await request(app)
      .get(`/posts?owner=${userCredentials.userId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    
    // All posts should have the same owner
    response.body.forEach((post: any) => {
      expect(post.owner).toBe(userCredentials.userId);
    });
  });
  
  test("GetById - Should return a specific post", async () => {
    const response = await request(app)
      .get(`/posts/${postId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });
  
  test("GetById - Should handle non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/posts/${fakeId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("not found");
  });
  
  test("GetById - Should handle invalid ID format", async () => {
    const response = await request(app)
      .get("/posts/invalidid")
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Update - Should handle invalid ID format", async () => {
    const updateData = {
      title: "This won't update",
      content: "Because the ID format is invalid"
    };
    
    const response = await request(app)
      .put("/posts/invalidid")
      .set("authorization", "JWT " + userCredentials.accessToken)
      .send(updateData);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Delete - Should delete a post", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(200);
    
    // Verify post is deleted
    const getResponse = await request(app)
      .get(`/posts/${postId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(getResponse.statusCode).toBe(404);
  });
  
  test("Delete - Should handle invalid ID format", async () => {
    const response = await request(app)
      .delete("/posts/invalidid")
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Delete - Non-existent ID should still return 200", async () => {
    // This is testing the behavior of the base controller which returns 200
    // even if the item doesn't exist (because the end result is the same: item is gone)
    const fakeId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/posts/${fakeId}`)
      .set("authorization", "JWT " + userCredentials.accessToken);
      
    expect(response.statusCode).toBe(200);
  });
}); 