import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import UserOauthModel from "../models/oauth_user_model";
import { Express } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

let app: Express;
let originalTokenSecret: string | undefined;
let originalTokenExpire: string | undefined;
let originalRefreshTokenExpire: string | undefined;

// Mock Google token verification
jest.mock('../utils/verifyGoogleToken', () => ({
  verifyGoogleToken: jest.fn().mockImplementation((credential) => {
    if (credential === 'invalid_token') {
      throw new Error('Invalid token');
    }
    return Promise.resolve({
      email: 'google@edge.com',
      name: 'Google Edge User',
      googleId: 'googleedge123',
      avatar: 'https://example.com/avatar.png'
    });
  })
}));

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  console.log("Before all auth edge case tests");
  app = await appInit();
  await userModel.deleteMany();
  await UserOauthModel.deleteMany();
  
  // Save original env values
  originalTokenSecret = process.env.TOKEN_SECRET;
  originalTokenExpire = process.env.TOKEN_EXPIRE;
  originalRefreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE;
});

afterAll(() => {
  console.log("After all auth edge case tests");
  
  // Restore original env values
  process.env.TOKEN_SECRET = originalTokenSecret;
  process.env.TOKEN_EXPIRE = originalTokenExpire;
  process.env.REFRESH_TOKEN_EXPIRE = originalRefreshTokenExpire;
  
  mongoose.connection.close();
});

describe("Auth Edge Cases Test", () => {
  // User data for testing
  const regularUser = {
    name: "Edge Test User",
    email: "edge@test.com",
    password: "password123"
  };
  
  let userTokens = {
    accessToken: "",
    refreshToken: "",
    userId: ""
  };
  
  // Register and login a user before tests
  beforeAll(async () => {
    // Register user
    const registerRes = await request(app).post("/auth/register").send(regularUser);
    expect(registerRes.statusCode).toBe(200);
    
    // Login to get tokens
    const loginRes = await request(app).post("/auth/login").send({
      email: regularUser.email,
      password: regularUser.password
    });
    
    expect(loginRes.statusCode).toBe(200);
    userTokens.accessToken = loginRes.body.accessToken;
    userTokens.refreshToken = loginRes.body.refreshToken;
    userTokens.userId = loginRes.body._id;
  });
  
  test("Request with invalid token should be rejected", async () => {
    // Use a made-up token on a protected endpoint
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer invalidtoken123")
      .send({
        title: "Test Post",
        content: "This is a test post"
      });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Access Denied");
  });
  
  test("Malformed authorization header should result in 401", async () => {
    // Wrong format - missing "Bearer " prefix on a protected endpoint
    const response = await request(app)
      .post("/posts")
      .set("authorization", userTokens.accessToken)
      .send({
        title: "Test Post",
        content: "This is a test post"
      });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Access Denied");
  });
  
  test("Refresh with invalid refresh token should fail", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: "invalid-token"
      });
      
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Access Denied");
  });
  
  test("Using refresh token then trying to use it again should fail", async () => {
    // First use is successful
    const response1 = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: userTokens.refreshToken
      });
      
    expect(response1.statusCode).toBe(200);
    const newRefreshToken = response1.body.refreshToken;
    
    // Second use fails because token was already used and removed
    const response2 = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: userTokens.refreshToken
      });
      
    expect(response2.statusCode).toBe(400);
    expect(response2.text).toBe("Access Denied");
    
    // Update token for future tests
    userTokens.refreshToken = newRefreshToken;
  });
  
  test("Refresh with non-existent user ID in token", async () => {
    // Create a custom token with non-existent user ID
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }
    
    const fakeRefreshToken = jwt.sign(
      {
        _id: new mongoose.Types.ObjectId().toString(), // Generate a random, non-existent ID
        random: Math.random().toString()
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
    
    // Try to refresh with fake token
    const refreshResponse = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: fakeRefreshToken
      });
      
    expect(refreshResponse.statusCode).toBe(400);
    expect(refreshResponse.text).toBe("Access Denied");
  });
  
  test("Login with incorrect password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: regularUser.email,
        password: "wrongpassword"
      });
      
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("wrong email or password");
  });
  
  test("Login with non-existent email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123"
      });
      
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("wrong email or password");
  });
  
  test("Multiple logins should generate distinct tokens", async () => {
    // First login
    const login1 = await request(app).post("/auth/login").send({
      email: regularUser.email,
      password: regularUser.password
    });
    
    const firstRefreshToken = login1.body.refreshToken;
    
    // Second login
    const login2 = await request(app).post("/auth/login").send({
      email: regularUser.email,
      password: regularUser.password
    });
    
    const secondRefreshToken = login2.body.refreshToken;
    
    // Tokens should be different
    expect(firstRefreshToken).not.toEqual(secondRefreshToken);
    
    // Both tokens should be valid
    const refresh1 = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: firstRefreshToken
      });
      
    expect(refresh1.statusCode).toBe(200);
    
    const refresh2 = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: secondRefreshToken
      });
      
    expect(refresh2.statusCode).toBe(200);
  });
  
  test("Logout should invalidate the refresh token", async () => {
    // Login to get a fresh token
    const loginResponse = await request(app).post("/auth/login").send({
      email: regularUser.email,
      password: regularUser.password
    });
    
    const refreshToken = loginResponse.body.refreshToken;
    
    // Logout
    const logoutResponse = await request(app)
      .post("/auth/logout")
      .send({
        refreshToken: refreshToken
      });
      
    expect(logoutResponse.statusCode).toBe(200);
    
    // Try to use the token after logout
    const refreshResponse = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: refreshToken
      });
      
    expect(refreshResponse.statusCode).toBe(400);
    expect(refreshResponse.text).toBe("Access Denied");
  });
}); 