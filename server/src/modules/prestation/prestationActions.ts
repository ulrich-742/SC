import type { RequestHandler } from "express";

// Import access to data
import PrestationRepository from "./prestationRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (_req, res, next) => {
  try {
    // Fetch all Prestations
    const Prestations = await PrestationRepository.readAll();

    // Respond with the Prestations in JSON format
    res.json(Prestations);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { name, price, duration_minutes } = req.body;

    const insertId = await PrestationRepository.create({
      name,
      price,
      duration_minutes,
      id_user: req.user.id,
    });

    res
      .status(201)
      .json({ id_prestation: insertId, name, price, duration_minutes });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const id = Number(req.params.id);
    const { name, price, duration_minutes } = req.body;

    await PrestationRepository.update(id, {
      name,
      price,
      duration_minutes,
      id_user: req.user.id,
    });

    res.json({
      id_prestation: id,
      name,
      price,
      duration_minutes,
    });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const id = Number(req.params.id);

    await PrestationRepository.delete(id, req.user.id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const browseByBarber: RequestHandler = async (req, res, next) => {
  try {
    const barberId = Number(req.params.id);

    const prestations = await PrestationRepository.readByBarber(barberId);

    res.json(prestations);
  } catch (err) {
    next(err);
  }
};

export default { browse, browseByBarber, add, edit, destroy };
