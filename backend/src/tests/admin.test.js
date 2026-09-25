import request from "supertest";
import app from "../app.js";

describe("Admin API", () => {
  let adminToken;
  let normalUserToken;
  let adminUserId;

  // Login before tests
  beforeAll(async () => {
    // Login as admin
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "controller@gmail.com",
        password: "1234",
      });

    console.log("Admin Login:", adminLogin.body);

    expect(adminLogin.statusCode).toBe(200);

    adminToken = adminLogin.body.data.token;
    adminUserId = adminLogin.body.data.user.id;

    expect(adminToken).toBeDefined();
    expect(adminUserId).toBeDefined();

  });

  // TC-ADMIN-001
  test("should get all users as admin", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get Users Status:", response.statusCode);
    console.log("Get Users Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-ADMIN-002
  test("should ban a user as admin", async () => {
    // Use an existing normal user's ID
    const targetUserId = 2;

    const response = await request(app)
      .post(`/api/admin/users/${targetUserId}/ban`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Ban User Status:", response.statusCode);
    console.log("Ban User Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.isBanned).toBe(true);
  });

  // TC-ADMIN-003
  test("should get all reports as admin", async () => {
    const response = await request(app)
      .get("/api/admin/reports")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Get Reports Status:", response.statusCode);
    console.log("Get Reports Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-ADMIN-004
  test("should update report status as admin", async () => {
    // Use an existing report ID
    const reportId = 1;

    const response = await request(app)
      .put(`/api/admin/reports/${reportId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "resolved",
      });

    console.log("Update Report Status:", response.statusCode);
    console.log("Update Report Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Report status updated.");
    expect(response.body.data).toBeDefined();
  });

});