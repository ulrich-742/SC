import type { RequestHandler } from "express";

// Import access to data
import eventRepository from "./eventRepository";

const formatToMySQLDateTime = (localDateTimeString: string): string => {
  if (!localDateTimeString) return "";
  return `${localDateTimeString.replace("T", " ")}:00`;
};

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (_req, res, next) => {
  try {
    // Fetch all event
    const event = await eventRepository.readAll();

    // Respond with the event in JSON format
    res.json(event);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
const edit: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status, start_date, end_date, location } =
      req.body;

    const image_url = req.file
      ? `/uploads/events/${req.file.filename}`
      : undefined;
    const formattedStartDate = formatToMySQLDateTime(start_date);
    const formattedEndDate = formatToMySQLDateTime(end_date);

    const affectedRows = await eventRepository.update(id, {
      title,
      description,
      status,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      location,
      image_url,
    });

    if (affectedRows === 0) {
      res.status(404).json({ error: "Événement introuvable" });
      return;
    }

    res.json({ message: "Événement mis à jour avec succès" });
  } catch (err) {
    next(err);
  }
};
const add: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, status, start_date, end_date, location } =
      req.body;

    const image_url = req.file ? `/uploads/events/${req.file.filename}` : "";
    const formattedStartDate = formatToMySQLDateTime(start_date);
    const formattedEndDate = formatToMySQLDateTime(end_date);

    const insertId = await eventRepository.create({
      title,
      description,
      status,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      location,
      image_url,
    });

    res.status(201).json({
      id_event: insertId,
      title,
      description,
      status,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      location,
      image_url,
    });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const affectedRows = await eventRepository.delete(id);

    if (affectedRows === 0) {
      res.status(404).json({ error: "Événement introuvable" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, edit, add, destroy };
