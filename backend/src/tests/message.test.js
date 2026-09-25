import request from "supertest";
import app from "../app.js";

describe("Message API", () => {
  let token;
  let friendId;

  // Login before tests
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ranahassan427726@gmail.com",
        password: "1234",
      });

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.data.token;

    // Use an actual user ID from your database
    friendId = 2;

    expect(token).toBeDefined();
  });

  // TC-MESSAGE-001
  test("should get chat history with valid authentication", async () => {
    const response = await request(app)
      .get(`/api/messages/${friendId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Chat History Status:", response.statusCode);
    console.log("Chat History Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-MESSAGE-002
  test("should reject chat history without authentication", async () => {
    const response = await request(app)
      .get(`/api/messages/${friendId}`);

    console.log("No Authentication Status:", response.statusCode);
    console.log("No Authentication Body:", response.body);

    expect(response.statusCode).toBe(401);
  });

  // TC-MESSAGE-003
  test("should check block status when user is not blocked", async () => {
    const response = await request(app)
      .get(`/api/messages/block-status/${friendId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Block Status:", response.statusCode);
    console.log("Block Status Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.isBlocked).toBe(false);
  });

  // TC-MESSAGE-004
  test("should reject chat history with invalid authentication token", async () => {
    const response = await request(app)
      .get(`/api/messages/${friendId}`)
      .set("Authorization", "Bearer invalid-token");

    console.log("Invalid Token Status:", response.statusCode);
    console.log("Invalid Token Body:", response.body);

    expect(response.statusCode).toBe(401);
  });
});