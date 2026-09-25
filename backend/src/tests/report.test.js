import request from "supertest";
import app from "../app.js";

describe("Report API", () => {
  let token;
  let userId;

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
  });

  // TC-REPORT-001
  test("should submit a report with valid information", async () => {
    const reportedUserId = 2;

    const response = await request(app)
      .post("/api/reports/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        reportedId: reportedUserId,
        reason: "Inappropriate content",
        description: "This user posted inappropriate content.",
      });

    console.log("Submit Report Status:", response.statusCode);
    console.log("Submit Report Body:", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Report submitted successfully."
    );
    expect(response.body.data).toBeDefined();
  });

  // TC-REPORT-002
  test("should reject report without authentication", async () => {
    const response = await request(app)
      .post("/api/reports/")
      .send({
        reportedId: 2,
        reason: "Inappropriate content",
        description: "This is a test report.",
      });

    console.log("No Auth Status:", response.statusCode);
    console.log("No Auth Body:", response.body);

    expect(response.statusCode).toBe(401);
  });

  // TC-REPORT-003
  test("should not allow user to report themselves", async () => {
    const response = await request(app)
      .post("/api/reports/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        reportedId: userId,
        reason: "Test reason",
        description: "Trying to report myself.",
      });

    console.log("Self Report Status:", response.statusCode);
    console.log("Self Report Body:", response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "You cannot report yourself."
    );
  });
});