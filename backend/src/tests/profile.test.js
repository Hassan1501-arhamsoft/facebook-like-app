import request from "supertest";
import app from "../app.js";

describe("Profile API", () => {

  test("should upload profile image with valid authentication", async () => {

    // Step 1: Login
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ranahassan427726@gmail.com",
        password: "1234"
      });

    // Step 2: Get JWT token
    const token = loginResponse.body.data.token;

    // Step 3: Upload profile image
    const response = await request(app)
      .put("/api/profile/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("profileImage", "uploads/1789124742971-654648968.jpeg");

    // Step 4: Check response
    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Profile image updated successfully."
    );
    expect(response.body.data).toBeDefined();

  });

});





