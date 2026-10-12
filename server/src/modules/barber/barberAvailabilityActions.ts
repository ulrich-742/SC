import type { RequestHandler } from "express";
import barberAvailabilityRepository from "./barberAvailabilityRepository";

// GET /api/barbers/:id/availability?date=YYYY-MM-DD
const browse: RequestHandler = async (req, res, next) => {
  try {
    const barberId = Number(req.params.id);
    const date = req.query.date as string;

    if (!date) {
      res.status(400).json({ message: "Paramètre date requis (YYYY-MM-DD)" });
      return;
    }

    const slots = await barberAvailabilityRepository.readAvailable(
      barberId,
      date,
    );
    res.json(slots);
  } catch (err) {
    next(err);
  }
};

// PUT /api/barbers/:id/schedule
const generate: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (Number(req.params.id) !== req.user.id) {
      return res.sendStatus(403);
    }

    const barberId = req.user.id;
    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
      res.status(400).json({ message: "schedule requis (tableau)" });
      return;
    }

    const count = await barberAvailabilityRepository.generateFromSchedule(
      barberId,
      schedule,
    );

    res.json({ message: "Créneaux générés", count });
  } catch (err) {
    next(err);
  }
};

export default { browse, generate };
