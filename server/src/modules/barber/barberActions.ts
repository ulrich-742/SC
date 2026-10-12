import type { RequestHandler } from "express";

// Import access to data
import barberRepository from "./barberRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all barbers
    const { startDate, endDate } = req.query;
    const barbers = await barberRepository.readAll({
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    });

    // Respond with the barbers in JSON format
    res.json(barbers);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Le R de BREAD - Read (Read One) operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // 1. On récupère l'id depuis les paramètres de la route (ex: /api/barbers/4)
    const id = Number(req.params.id);

    // 2. On appelle notre méthode du repository
    const barber = await barberRepository.read(id);

    // 3. Si on ne trouve pas le barbier, on renvoie une erreur 404
    if (barber == null) {
      res.sendStatus(404);
    } else {
      // Sinon, on répond avec le barbier au format JSON
      res.json(barber);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const id_user = Number(req.params.id);
    const updatedCustomerData = { ...req.body, id_user };
    if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
      return res.sendStatus(403);
    }

    // Appel au repository pour sauvegarder en BDD
    await barberRepository.update(updatedCustomerData);

    // On renvoie un statut 200 avec les données
    res.status(200).json({
      message: "Client mis à jour avec succès",
      data: updatedCustomerData,
    });
  } catch (err) {
    next(err);
  }
};

const readPortfolio: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const portfolio = await barberRepository.readPortfolio(id);
    res.json(portfolio);
  } catch (err) {
    next(err);
  }
};

// On n'oublie pas d'exposer "read" ici pour le routeur !
export default { browse, read, edit, readPortfolio };
