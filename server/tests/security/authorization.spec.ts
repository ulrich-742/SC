import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../src/app";
const request = supertest.agent(app);

const token = (id: number, role: "customer" | "barber" | "admin") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string);

describe("API authorization", () => {
  it("returns 401 when a protected route has no token", async () => {
    expect((await request.get("/api/users")).status).toBe(401);
  });

  it("returns 401 for an invalid token", async () => {
    const response = await request.get("/api/users").set("Authorization", "Bearer invalid");
    expect(response.status).toBe(401);
  });

  it("prevents a customer from listing users", async () => {
    const response = await request.get("/api/users").set("Authorization", `Bearer ${token(10, "customer")}`);
    expect(response.status).toBe(403);
  });

  it("prevents IDOR on another customer profile", async () => {
    const response = await request.get("/api/customers/11").set("Authorization", `Bearer ${token(10, "customer")}`);
    expect(response.status).toBe(403);
  });

  it("rejects admin self-registration", async () => {
    const response = await request.post("/api/register").send({
      email: "admin@example.com",
      password: "StrongPassword1!",
      role: "admin",
      firstname: "Fake",
      lastname: "Admin",
    });
    expect(response.status).toBe(400);
  });

  it("returns a JSON 404 for an unknown API route", async () => {
    const response = await request.get("/api/unknown");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
