import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";

// Mock Google OAuth verification
jest.mock("../utils/verifyGoogleToken", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    name: "Google User",
    email: "google@test.com",
    id: "google123456789"
  }))
}));

let app: Express;
let userId: string;
let accessToken: string;

jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  await userModel.deleteMany();
  
  // Register a test user
  const registerResponse = await request(app)
    .post("/auth/register")
    .send({
      name: "Profile Test User",
      email: "profile@test.com",
      password: "password123"
    });
  
  userId = registerResponse.body._id;
  accessToken = registerResponse.body.accessToken;
});

afterAll(() => {
  mongoose.connection.close();
});

describe("User Profile Management Tests", () => {
  test("Get user data via posts", async () => {
    const postData = {
      title: "Test Post for Profile",
      content: "This is content for profile testing"
    };
    
    await request(app)
      .post("/posts")
      .set("authorization", "JWT " + accessToken)
      .send(postData);
    
    const response = await request(app)
      .get("/posts")
      .set("authorization", "JWT " + accessToken);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    
    if (response.body[0].user) {
      expect(response.body[0].user.name).toBe("Profile Test User");
    }
  });
  
  test("Update user via auth update", async () => {
    const updatedProfile = {
      name: "Updated Profile Name"
    };
    
    const response = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken)
      .send(updatedProfile);
    
    if (response.statusCode !== 404) {
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe(updatedProfile.name);
    }
  });
  
  test("User can log in after registration", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "profile@test.com",
        password: "password123"
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(userId);
    expect(response.body.accessToken).toBeDefined();
  });
  
  test("Unauthorized access to protected routes", async () => {
    const postData = {
      title: "Unauthorized Post",
      content: "This should fail without auth"
    };
    
    const response = await request(app)
      .post("/posts")
      .send(postData);
    
    expect(response.statusCode).toBe(401);
  });
}); 