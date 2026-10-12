import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../../src/app";
import appointmentRepository from "../../src/modules/appointment/appointmentRepository";
import reviewRepository from "../../src/modules/review/reviewRepository";

const request = supertest(app);
const token = (id: number, role: "customer" | "barber" | "admin") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET as string);

afterEach(() => jest.restoreAllMocks());

describe("Booking business rules", () => {
  const payload = {
    appointment_date: "2099-05-22 15:30:00",
    location_type: "Au salon",
    id_prestation: 2,
    id_user_barber: 4,
  };

  it("allows a customer to reserve an available slot", async () => {
    jest.spyOn(appointmentRepository, "create").mockResolvedValue({} as never);
    const response = await request.post("/api/appointments")
      .set("Authorization", `Bearer ${token(10, "customer")}`)
      .send(payload);
    expect(response.status).toBe(201);
    expect(appointmentRepository.create).toHaveBeenCalledWith(expect.objectContaining({ id_user_customer: 10 }));
  });

  it("prevents a barber from booking as a customer", async () => {
    const response = await request.post("/api/appointments")
      .set("Authorization", `Bearer ${token(4, "barber")}`)
      .send(payload);
    expect(response.status).toBe(403);
  });

  it("returns 409 when the slot was already taken", async () => {
    jest.spyOn(appointmentRepository, "create").mockRejectedValue(Object.assign(new Error("Ce créneau n'est plus disponible"), { status: 409 }));
    const response = await request.post("/api/appointments")
      .set("Authorization", `Bearer ${token(10, "customer")}`)
      .send(payload);
    expect(response.status).toBe(409);
  });

  it("rejects an invalid rating before accessing the database", async () => {
    const create = jest.spyOn(reviewRepository, "create");
    const response = await request.post("/api/reviews")
      .set("Authorization", `Bearer ${token(10, "customer")}`)
      .send({ rating: 6, comment: "non", id_appointment: 1 });
    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });
});
