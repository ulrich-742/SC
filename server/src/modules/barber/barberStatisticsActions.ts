import type { RequestHandler } from "express";
import barberStatisticsRepository from "./barberStatisticsRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (Number(req.params.id) !== req.user.id) {
      return res.sendStatus(403);
    }

    const barberId = req.user.id;
    const stats = await barberStatisticsRepository.readStats(barberId);

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export default { browse };
