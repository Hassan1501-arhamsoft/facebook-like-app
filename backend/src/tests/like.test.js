import request from "supertest";
import app from "../app.js";

describe("Like API", () => {
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
    postId = 4;
  });

  // TC-LIKE-001
  test("should like a post with valid authentication", async () => {
    const response = await request(app)
      .post(`/api/likes/${postId}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Like Status:", response.statusCode);
    console.log("Like Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.likesCount).toBeDefined();
  });

  // TC-LIKE-002
  test("should unlike a previously liked post", async () => {
    const response = await request(app)
      .post(`/api/likes/${postId}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Unlike Status:", response.statusCode);
    console.log("Unlike Body:", response.body);

    expect(response.statusCode).toBe(200);
 
    expect(response.body.likesCount).toBeDefined();
  });

});