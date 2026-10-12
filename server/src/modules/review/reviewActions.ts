import type { RequestHandler } from "express";

// Import access to data
import reviewRepository from "./reviewRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all reviews
    const { startDate, endDate } = req.query;
    const reviews = await reviewRepository.readAll({
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    });

    // Respond with the reviews in JSON format
    res.json(reviews);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
const browseforadmin: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all reviews
    const { startDate, endDate } = req.query;
    const reviews = await reviewRepository.readAllForAdmin({
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    });

    // Respond with the reviews in JSON format
    res.json(reviews);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
const browseByBarber: RequestHandler = async (req, res, next) => {
  try {
    const barberId = Number(req.params.id);
    const reviews = await reviewRepository.readByBarber(barberId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await reviewRepository.delete(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
const add: RequestHandler = async (req, res, next) => {
  try {
    const { rating, comment, id_appointment } = req.body;
    if (!rating || !id_appointment) {
      res.status(400).json({ message: "Note et rendez-vous requis" });
      return;
    }
    const result = await reviewRepository.create({
      rating: Number(rating),
      comment: comment ?? "",
      id_appointment: Number(id_appointment),
      id_user_customer: req.user?.id as number,
    });
    res.status(201).json({
      message: "Avis publié",
      id: (result as { insertId: number }).insertId,
    });
  } catch (err) {
    next(err);
  }
};

export default { browse, browseforadmin, browseByBarber, destroy, add };
