import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import UserOauthModel from "../models/oauth_user_model";
import { Express } from "express";
import jwt from 'jsonwebtoken';
import * as verifyTokenModule from '../utils/verifyGoogleToken';

let app: Express;

// Create a spy for the verifyGoogleToken function to track real calls
const originalVerifyGoogleToken = verifyTokenModule.verifyGoogleToken;
const verifyGoogleTokenSpy = jest.spyOn(verifyTokenModule, 'verifyGoogleToken');

// Mock Google token verification for most tests
verifyGoogleTokenSpy.mockImplementation((credential) => {
  if (credential === 'invalid_token') {
    throw new Error('Invalid token');
  }
  return Promise.resolve({
    email: 'google@test.com',
    name: 'Google User',
    googleId: 'google123',
    avatar: 'https://example.com/avatar.png'
  });
});

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  await UserOauthModel.deleteMany();
});

afterAll(() => {
  verifyGoogleTokenSpy.mockRestore();
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
  
  // Use the real implementation for this test to improve coverage
  test("Test token verification error handling with real implementation", async () => {
    // Temporarily use the real implementation
    verifyGoogleTokenSpy.mockImplementationOnce(originalVerifyGoogleToken);
    
    // This will likely fail with the real implementation since we're using a fake token
    // But the important part is that it will exercise the error handling code
    const response = await request(app)
      .post("/auth/oauth-login")
      .send({ credential: 'test_real_implementation' });
    
    // We expect this to fail because we're using a fake token
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Google OAuth failed');
  });
}); 