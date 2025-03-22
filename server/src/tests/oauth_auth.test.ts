import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import UserOauthModel from "../models/oauth_user_model";
import { Express } from "express";
import jwt from 'jsonwebtoken';

let app: Express;

// Mock Google token verification
jest.mock('../utils/verifyGoogleToken', () => ({
  verifyGoogleToken: jest.fn().mockImplementation((credential) => {
    if (credential === 'invalid_token') {
      throw new Error('Invalid token');
    }
    return Promise.resolve({
      email: 'google@test.com',
      name: 'Google User',
      googleId: 'google123',
      avatar: 'https://example.com/avatar.png'
    });
  })
}));

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  console.log("Before all OAuth tests");
  app = await appInit();
  await UserOauthModel.deleteMany();
});

afterAll(() => {
  console.log("After all OAuth tests");
  mongoose.connection.close();
});

describe("OAuth Authentication Test", () => {
  test("Test Google registration", async () => {
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User registerd Successfully');
  });

  test("Test Google registration with invalid token", async () => {
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'invalid_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Google OAuth failed');
  });
  
  test("Test Google registration when user already exists", async () => {
    // First registration
    await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
      
    // Second attempt with same credentials
    const response = await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('User already registerd with that email');
  });

  test("Test Google login success", async () => {
    // Register first
    await request(app)
      .post("/auth/oauth-register")
      .send({ credential: 'valid_google_token' });
      
    // Then login
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
  });

  test("Test Google login with unregistered user", async () => {
    // Clear database first
    await UserOauthModel.deleteMany();
    
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'valid_google_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User is not registerd');
  });
  
  test("Test Google login with invalid token", async () => {
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'invalid_token' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Google OAuth failed');
  });
}); 