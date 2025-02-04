const request = require("supertest");
const app = require("../server"); // Ensure this points to your main app file

describe("Authentication API Tests", () => {
  let token = "";

  test("User should sign up successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "Test@1234"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("User should not sign up with duplicate email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "Test@1234"
    });

    expect(res.statusCode).toBe(400);
  });

  test("User should log in successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Test@1234"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // Store for later tests
  });

  test("User should not log in with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword"
    });

    expect(res.statusCode).toBe(401);
  });

  test("User should access protected route with token", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("User should not access protected route without token", async () => {
    const res = await request(app).get("/api/auth/protected");

    expect(res.statusCode).toBe(401);
  });
});
