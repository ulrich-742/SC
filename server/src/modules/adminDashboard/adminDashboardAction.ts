import type { RequestHandler } from "express";

import appointmentRepository from "../appointment/appointmentRepository";
import barberRepository from "../barber/barberRepository";
import reviewRepository from "../review/reviewRepository";
import userRepository from "../user/userRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all barbers, appointments, reviews, and users
    const { startDate, endDate } = req.query;
    const [barbers, appointments, reviews, users] = await Promise.all([
      barberRepository.readAll({
        startDate: typeof startDate === "string" ? startDate : undefined,
        endDate: typeof endDate === "string" ? endDate : undefined,
      }),
      appointmentRepository.readAll({
        startDate: typeof startDate === "string" ? startDate : undefined,
        endDate: typeof endDate === "string" ? endDate : undefined,
      }),
      reviewRepository.readAll({
        startDate: typeof startDate === "string" ? startDate : undefined,
        endDate: typeof endDate === "string" ? endDate : undefined,
      }),
      userRepository.readAll({
        startDate: typeof startDate === "string" ? startDate : undefined,
        endDate: typeof endDate === "string" ? endDate : undefined,
      }),
    ]);

    // Respond with the data in JSON format
    res.json({ barbers, appointments, reviews, users });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse };
