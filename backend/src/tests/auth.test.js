import request from "supertest";
import app from "../app.js";

describe("Authentication API", () => {

  test("Login API should respond", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "",
        password: "1234"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBeDefined();
  });



test("should register a new user with profile image", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .field("name", "Test User")
    .field("email", `cat@gmail.com`)
    .field("password", "1234")
    .attach("profileImage" , "uploads/1789124742971-654648968.jpeg")
    

  console.log("Status:", response.statusCode);
  console.log("Body:", response.body);

  expect(response.statusCode).toBe(201);
});

});



