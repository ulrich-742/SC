import argon2 from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { emailRegex, passwordRegex } from "../../utils/validation";
import barberRepository from "../barber/barberRepository";
import customerRepository from "../customer/customerRepository";
import userRepository from "./userRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all users
    const { startDate, endDate } = req.query;
    const users = await userRepository.readAll({
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    });

    // Respond with the users in JSON format
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const register: RequestHandler = async (req, res, next) => {
  try {
    const {
      email: rawEmail,
      password,
      role,
      firstname,
      lastname,
      postalCode,
      city,
      address,
      birthday,
      phone,
    } = req.body;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    if (role !== "customer" && role !== "barber") {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    if (!password) {
      return res.status(400).json({
        message: "Mot de passe requis",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "Adresse email requise",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Adresse email invalide",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    const hashedPassword = await argon2.hash(password);
    const result = await userRepository.create({
      email,
      password: hashedPassword,
      user_type: role,
      phone,
      birthday,
    });

    const userId = result.insertId;

    if (role === "barber") {
      await barberRepository.create({
        id_user: userId,
        name: `${firstname} ${lastname}`,
        postal_code: postalCode ?? "",
        city: city ?? "",
        adress: address ?? "",
      });
    } else {
      await customerRepository.create({
        id_user: userId,
        firstname,
        lastname,
        postal_code: postalCode,
        city,
        adress: address,
      });
    }

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;
    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const user = await userRepository.readByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }
    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      {
        id: user.id_user,
        role: user.user_type,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user.id_user,
        email: user.email,
        role: user.user_type,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
      return res.sendStatus(403);
    }
    const id_user = Number(req.params.id);

    // Appel au repository pour sauvegarder en BDD
    await userRepository.delete(id_user);

    // On renvoie un statut 204 (No Content) ou 200 avec les données
    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      id: id_user,
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (email && emailRegex.test(email)) await userRepository.readByEmail(email);
    res.json({
      message: "Si un compte existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (err) {
    next(err);
  }
};

export default { browse, deleteUser, register, login, forgotPassword };
