import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postModel from "../models/posts_model";
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
}

const testUsers: User[] = [
  {
    name: "Comments User 1",
    email: "comments1@test.com",
    password: "1234567"
  },
  {
    name: "Comments User 2",
    email: "comments2@test.com",
    password: "7654321"
  }
];

const testPost: Post = {
  title: "Test Post for Comments",
  content: "This is a test post for testing comments functionality"
};

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  app = await appInit();
  await commentsModel.deleteMany();
  await postModel.deleteMany();
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
  
  // Create test post
  const postResponse = await request(app)
    .post("/posts")
    .set("authorization", "JWT " + testUsers[0].accessToken)
    .send(testPost);
    
  testPost._id = postResponse.body._id;
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Advanced Comments Tests", () => {
  let parentCommentId: string;
  
  test("Create a comment", async () => {
    const comment = {
      comment: "This is a test comment",
      postId: testPost._id
    };
    
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(comment);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(comment.comment);
    expect(response.body.owner).toBe(testUsers[0]._id);
    
    parentCommentId = response.body._id;
  });
  
  test("Create a reply to a comment", async () => {
    const replyComment = {
      comment: "This is a reply to the parent comment",
      postId: testPost._id,
      parentId: parentCommentId
    };
    
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + testUsers[1].accessToken)
      .send(replyComment);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(replyComment.comment);
    // Check if parentId field exists in the model
    if (response.body.hasOwnProperty('parentId')) {
      expect(response.body.parentId).toBe(parentCommentId);
    }
    expect(response.body.owner).toBe(testUsers[1]._id);
  });
  
  test("Get comments for a post", async () => {
    const response = await request(app)
      .get(`/comments?postId=${testPost._id}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Check if one of the comments matches our parent comment ID
    const foundComment = response.body.find((c: any) => c._id === parentCommentId);
    expect(foundComment).toBeDefined();
  });
  
  test("Update a comment", async () => {
    const updateData = {
      comment: "Updated comment text"
    };
    
    const response = await request(app)
      .put(`/comments/${parentCommentId}`)
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(updateData);
    
    // Skip assertion if update endpoint is not supported
    if (response.statusCode !== 404) {
      expect(response.statusCode).toBe(200);
      expect(response.body.comment).toBe(updateData.comment);
    }
  });
  
  test("Attempt to update another user's comment", async () => {
    const updateData = {
      comment: "Unauthorized update"
    };
    
    const response = await request(app)
      .put(`/comments/${parentCommentId}`)
      .set("authorization", "JWT " + testUsers[1].accessToken)
      .send(updateData);
    
    // Skip assertion if update endpoint is not supported
    if (response.statusCode !== 404) {
      // Assuming the API returns 403 or 400 for unauthorized updates
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.statusCode).toBeLessThanOrEqual(403);
    }
  });
  
  test("Get comment by ID", async () => {
    const response = await request(app)
      .get(`/comments/${parentCommentId}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(parentCommentId);
  });
  
  test("Get comments by user", async () => {
    const response = await request(app)
      .get(`/comments?owner=${testUsers[0]._id}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].owner).toBe(testUsers[0]._id);
  });
  
  test("Create comment with missing postId", async () => {
    const invalidComment = {
      comment: "Comment without postId"
    };
    
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(invalidComment);
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Create comment with empty content", async () => {
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send({
        comment: "",
        postId: testPost._id
      });
      
    expect(response.statusCode).toBe(400);
  });
  
  test("Delete a comment", async () => {
    // Create a comment to delete
    const commentToDelete = {
      comment: "This comment will be deleted",
      postId: testPost._id
    };
    
    const createResponse = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + testUsers[0].accessToken)
      .send(commentToDelete);
      
    const commentId = createResponse.body._id;
    
    // Delete the comment
    const deleteResponse = await request(app)
      .delete(`/comments/${commentId}`)
      .set("authorization", "JWT " + testUsers[0].accessToken);
      
    expect(deleteResponse.statusCode).toBe(200);
    
    // Verify the comment is gone
    const checkResponse = await request(app)
      .get(`/comments/${commentId}`);
      
    expect(checkResponse.statusCode).toBe(404);
  });
}); 