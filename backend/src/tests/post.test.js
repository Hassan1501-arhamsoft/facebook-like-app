import request from "supertest";
import app from "../app.js";



//* Return a dummy socket object so tests don't crash
export const getIO = () => {
  if (!io) {
    if (process.env.NODE_ENV === "test") {
      return { emit: () => {} }; 
    }
    
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

describe("Post API", () => {
  let token;
  let userId;

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
    userId = loginResponse.body.data.user.id;

    expect(token).toBeDefined();
    expect(userId).toBeDefined();
    
  });

  // TC-POST-002
  test("should reject creating post without authentication", async () => {
    const response = await request(app)
      .post("/api/posts")
      .field("description", "Unauthorized post")
      .attach("postImage", "uploads/1789742930189-963121907.png");

    console.log("Unauthorized Post Status:", response.statusCode);
    console.log("Unauthorized Post Body:", response.body);

    expect(response.statusCode).toBe(401);
  });

  // TC-POST-003
  test("should reject creating post without image", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .field("description", "Post without image");

    console.log("No Image Status:", response.statusCode);
    console.log("No Image Body:", response.body);

    expect(response.statusCode).toBe(500);
  });

  // TC-POST-004
  test("should get user's own posts", async () => {
    const response = await request(app)
      .get("/api/posts/my-posts")
      .set("Authorization", `Bearer ${token}`);

    console.log("My Posts Status:", response.statusCode);
    console.log("My Posts Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-POST-005
  test("should get saved posts", async () => {
    const response = await request(app)
      .get("/api/posts/saved")
      .set("Authorization", `Bearer ${token}`);

    console.log("Saved Posts Status:", response.statusCode);
    console.log("Saved Posts Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });



  // TC-POST-007
  test("should get global feed", async () => {
    const response = await request(app)
      .get("/api/posts/feed")
      .set("Authorization", `Bearer ${token}`);

    console.log("Global Feed Status:", response.statusCode);
    console.log("Global Feed Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // TC-POST-008
  test("should get friends feed", async () => {
    const response = await request(app)
      .get("/api/posts/friends-feed")
      .set("Authorization", `Bearer ${token}`);

    console.log("Friends Feed Status:", response.statusCode);
    console.log("Friends Feed Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

});