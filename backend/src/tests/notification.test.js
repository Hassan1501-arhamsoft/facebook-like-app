import request from "supertest";
import app from "../app.js";

describe("Notification API", () => {
  let token;

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
  });

  // TC-NOTIFICATION-001
  test("should get user notifications with valid authentication", async () => {
    const response = await request(app)
      .get("/api/notifications/")
      .set("Authorization", `Bearer ${token}`);

    console.log("Notification Status:", response.statusCode);
    console.log("Notification Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-NOTIFICATION-002
  test("should reject getting notifications without authentication", async () => {
    const response = await request(app)
      .get("/api/notifications/");

    console.log("No Auth Status:", response.statusCode);
    console.log("No Auth Body:", response.body);

    expect(response.statusCode).toBe(401);
  });

  // TC-NOTIFICATION-003
  test("should reject getting notifications with invalid authentication token", async () => {
    const response = await request(app)
      .get("/api/notifications/")
      .set("Authorization", "Bearer invalid-token");

    console.log("Invalid Token Status:", response.statusCode);
    console.log("Invalid Token Body:", response.body);

    expect(response.statusCode).toBe(401);
  });
});