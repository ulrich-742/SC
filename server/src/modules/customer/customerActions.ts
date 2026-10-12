import type { RequestHandler } from "express";

// Import access to data
import customerRepository from "./customerRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      return res.sendStatus(403);
    }

    const customers = await customerRepository.readAll();

    res.json(customers);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.id !== Number(req.params.id)) {
      return res.sendStatus(403);
    }
    // Fetch all customers
    const customer = await customerRepository.read(Number(req.params.id));

    // Respond with the customers in JSON format
    res.json(customer);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
const edit: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
      return res.sendStatus(403);
    }

    const id_user = Number(req.params.id);
    const updatedCustomerData = { ...req.body, id_user };

    await customerRepository.update(updatedCustomerData);

    res.status(200).json({
      message: "Client mis à jour avec succès",
      data: updatedCustomerData,
    });
  } catch (err) {
    next(err);
  }
};

export default { browse, edit, read };
