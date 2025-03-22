import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import UserOauthModel from "../models/oauth_user_model";
import { Express } from "express";

let app: Express;

// Mock Google token verification
jest.mock('../utils/verifyGoogleToken', () => ({
  verifyGoogleToken: jest.fn().mockImplementation((credential) => {
    if (credential === 'invalid_token') {
      throw new Error('Invalid token');
    }
    return Promise.resolve({
      email: 'oauth@test.handler.com',
      name: 'OAuth Handler Test User',
      googleId: 'google123handler',
      avatar: 'https://example.com/avatar.png'
    });
  })
}));

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  console.log("Before all OAuth handler tests");
  app = await appInit();
  await UserOauthModel.deleteMany();
});

afterAll(() => {
  console.log("After all OAuth handler tests");
  mongoose.connection.close();
});

describe("OAuth Handler Tests", () => {
  let userId: string;
  
  test("Register OAuth user", async () => {
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User registerd Successfully');
  });
  
  test("Register OAuth user with same credentials should fail", async () => {
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('User already registerd with that email');
  });
  
  test("Register with invalid token should fail", async () => {
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'invalid_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Google OAuth failed');
  });
  
  test("OAuth login success", async () => {
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    
    // Save user ID for profile tests
    userId = response.body._id;
  });
  
  test("OAuth login with non-existent user", async () => {
    // First delete the user
    await UserOauthModel.deleteMany();
    
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User is not registerd');
  });
  
  test("OAuth login with invalid token", async () => {
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'invalid_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Google OAuth failed');
  });
}); 