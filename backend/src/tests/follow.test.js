import request from "supertest";
import app from "../app.js";

describe("Follow API", () => {
  let token;
  let userId;
  let otherUserId;

  // Login before tests
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ranahassan427726@gmail.com",
        password: "1234",
      });

    console.log("Login Status:", loginResponse.statusCode);
    console.log("Login Body:", loginResponse.body);

    expect(loginResponse.statusCode).toBe(200);

    token = loginResponse.body.data.token;
    userId = loginResponse.body.data.user.id;

    expect(token).toBeDefined();
    expect(userId).toBeDefined();

    // Use an existing different user ID from your database
    otherUserId = 2;
  });

  // TC-FOLLOW-001
  test("should get user suggestions with valid authentication", async () => {
    const response = await request(app)
      .get("/api/follows/suggestions")
      .set("Authorization", `Bearer ${token}`);

    console.log("Suggestions Status:", response.statusCode);
    console.log("Suggestions Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-FOLLOW-002
  test("should send a follow request", async () => {
    const response = await request(app)
      .post(`/api/follows/${otherUserId}/request`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Follow Request Status:", response.statusCode);
    console.log("Follow Request Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    // First request should create a pending request
    expect(response.body.action).toBe("requested");
  });

  // TC-FOLLOW-003
  test("should get pending follow requests", async () => {
    const response = await request(app)
      .get("/api/follows/requests")
      .set("Authorization", `Bearer ${token}`);

    console.log("Pending Requests Status:", response.statusCode);
    console.log("Pending Requests Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-FOLLOW-004
  test("should get friends list", async () => {
    const response = await request(app)
      .get("/api/follows/friends")
      .set("Authorization", `Bearer ${token}`);

    console.log("Friends Status:", response.statusCode);
    console.log("Friends Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

});