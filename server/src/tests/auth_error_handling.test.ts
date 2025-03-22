import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";
import jwt from "jsonwebtoken";

let app: Express;
const originalEnv = { ...process.env };

// Mock verifyGoogleToken
jest.mock('../utils/verifyGoogleToken', () => ({
  verifyGoogleToken: jest.fn().mockImplementation((credential) => {
    if (credential === 'invalid_token') {
      throw new Error('Invalid token');
    }
    if (credential === 'network_error') {
      throw new Error('Network error');
    }
    return Promise.resolve({
      email: 'oauth@error.test',
      name: 'OAuth Error Test User',
      googleId: 'googleerror123',
      avatar: 'https://example.com/avatar.png'
    });
  })
}));

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  console.log("Before all auth error handling tests");
  app = await appInit();
  await userModel.deleteMany();
});

afterAll(() => {
  console.log("After all auth error handling tests");
  // Restore environment variables
  Object.keys(originalEnv).forEach(key => {
    process.env[key] = originalEnv[key];
  });
  mongoose.connection.close();
});

describe("Auth Error Handling Tests", () => {
  const testUser = {
    name: "Error Test User",
    email: "errortest@example.com",
    password: "password123"
  };
  
  test("Registration with missing required fields should fail", async () => {
    const incompleteUser = {
      name: "Incomplete User"
      // Missing email and password
    };
    
    const response = await request(app)
      .post("/auth/register")
      .send(incompleteUser);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Register user with valid data should succeed", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
  });
  
  test("Using malformed JWT token should be rejected", async () => {
    // Generate a token with missing parts
    const malformedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // Header only
    
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + malformedToken)
      .send({
        title: "Test Post",
        content: "This is a test post"
      });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Access Denied");
  });
  
  test("Login and then generate token error with missing TOKEN_SECRET", async () => {
    // Login first
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
      
    expect(loginResponse.statusCode).toBe(200);
    
    // Save the token
    const userToken = loginResponse.body.refreshToken;
    
    // Temporarily remove TOKEN_SECRET
    const savedTokenSecret = process.env.TOKEN_SECRET;
    process.env.TOKEN_SECRET = undefined;
    
    // Try to refresh token
    const refreshResponse = await request(app)
      .post("/auth/refresh")
      .send({
        refreshToken: userToken
      });
      
    // Should handle the missing TOKEN_SECRET error
    expect(refreshResponse.statusCode).toBe(400);
    
    // Restore TOKEN_SECRET
    process.env.TOKEN_SECRET = savedTokenSecret;
  });
  
  test("Should handle expired token correctly", async () => {
    // Login to get valid tokens
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
      
    // Save the original token expiry
    const originalTokenExpire = process.env.TOKEN_EXPIRE;
    
    // Create a token that expires immediately
    process.env.TOKEN_EXPIRE = '1ms';
    
    // Get a new token with the short expiry
    const shortLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
      
    const shortLivedToken = shortLoginResponse.body.accessToken;
    
    // Wait for token to expire
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try to use the expired token
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + shortLivedToken)
      .send({
        title: "Test Post",
        content: "This is a test post"
      });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Access Denied");
    
    // Restore original token expiry
    process.env.TOKEN_EXPIRE = originalTokenExpire;
  });
  
  test("Should handle token with wrong signature", async () => {
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }
    
    // Create a token with a wrong signature
    const payload = {
      _id: new mongoose.Types.ObjectId().toString(),
      random: Math.random().toString()
    };
    
    // Sign with a different secret
    const wrongToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET + "wrong", // Wrong secret
      { expiresIn: '1h' }
    );
    
    // Try to use the token with wrong signature
    const response = await request(app)
      .post("/posts")
      .set("authorization", "Bearer " + wrongToken)
      .send({
        title: "Test Post",
        content: "This is a test post"
      });
      
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Access Denied");
  });
}); 