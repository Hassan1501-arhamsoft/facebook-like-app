import request from "supertest";
import app from "../app.js";

describe("Comment API", () => {
  let token;
  let postId;

  // Login before tests
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ranahassan427726@gmail.com",
        password: "1234",
      });

    console.log("Login Response:", loginResponse.body);

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.data.token;

    expect(token).toBeDefined();

    // Use an existing post ID from your database
    postId = 1;
  });

  // TC-COMMENT-001
  test("should add a comment to a post with valid authentication", async () => {
    const response = await request(app)
      .post(`/api/comments/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "This is a test comment",
      });

    console.log("Add Comment Status:", response.statusCode);
    console.log("Add Comment Body:", response.body);

    expect([200, 201]).toContain(response.statusCode);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  // TC-COMMENT-002
  test("should get comments of a post with valid authentication", async () => {
    const response = await request(app)
      .get(`/api/comments/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Get Comments Status:", response.statusCode);
    console.log("Get Comments Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-COMMENT-003
  test("should reject adding a comment without authentication", async () => {
    const response = await request(app)
      .post(`/api/comments/${postId}`)
      .send({
        text: "Unauthorized comment",
      });

    console.log("No Auth Add Comment Status:", response.statusCode);
    console.log("No Auth Add Comment Body:", response.body);

    expect(response.statusCode).toBe(401);
  });

  // TC-COMMENT-004
  test("should reject getting comments without authentication", async () => {
    const response = await request(app)
      .get(`/api/comments/${postId}`);

    console.log("No Auth Get Comments Status:", response.statusCode);
    console.log("No Auth Get Comments Body:", response.body);

    expect(response.statusCode).toBe(401);
  });


});