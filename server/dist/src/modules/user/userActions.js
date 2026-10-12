"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../../utils/validation");
const barberRepository_1 = __importDefault(require("../barber/barberRepository"));
const customerRepository_1 = __importDefault(require("../customer/customerRepository"));
const userRepository_1 = __importDefault(require("./userRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
    try {
        // Fetch all users
        const { startDate, endDate } = req.query;
        const users = await userRepository_1.default.readAll({
            startDate: typeof startDate === "string" ? startDate : undefined,
            endDate: typeof endDate === "string" ? endDate : undefined,
        });
        // Respond with the users in JSON format
        res.json(users);
    }
    catch (err) {
        next(err);
    }
};
const register = async (req, res, next) => {
    try {
        const { email: rawEmail, password, role, firstname, lastname, postalCode, city, address, birthday, phone, } = req.body;
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
        if (!validation_1.emailRegex.test(email)) {
            return res.status(400).json({
                message: "Adresse email invalide",
            });
        }
        if (!validation_1.passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
            });
        }
        const hashedPassword = await argon2_1.default.hash(password);
        const result = await userRepository_1.default.create({
            email,
            password: hashedPassword,
            user_type: role,
            phone,
            birthday,
        });
        const userId = result.insertId;
        if (role === "barber") {
            await barberRepository_1.default.create({
                id_user: userId,
                name: `${firstname} ${lastname}`,
                postal_code: postalCode ?? "",
                city: city ?? "",
                adress: address ?? "",
            });
        }
        else {
            await customerRepository_1.default.create({
                id_user: userId,
                firstname,
                lastname,
                postal_code: postalCode,
                city,
                adress: address,
            });
        }
        res.status(201).json({ message: "Utilisateur créé" });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};
const login = async (req, res, next) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = req.body.password;
        if (!email || typeof password !== "string") {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }
        const user = await userRepository_1.default.readByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect",
            });
        }
        const isValidPassword = await argon2_1.default.verify(user.password, password);
        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: "Email ou mot de passe incorrect" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id_user,
            role: user.user_type,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user.id_user,
                email: user.email,
                role: user.user_type,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
            return res.sendStatus(403);
        }
        const id_user = Number(req.params.id);
        // Appel au repository pour sauvegarder en BDD
        await userRepository_1.default.delete(id_user);
        // On renvoie un statut 204 (No Content) ou 200 avec les données
        res.status(200).json({
            message: "Utilisateur supprimé avec succès",
            id: id_user,
        });
    }
    catch (err) {
        next(err);
    }
};
const forgotPassword = async (req, res, next) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        if (email && validation_1.emailRegex.test(email))
            await userRepository_1.default.readByEmail(email);
        res.json({
            message: "Si un compte existe, un lien de réinitialisation a été envoyé.",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.default = { browse, deleteUser, register, login, forgotPassword };
//# sourceMappingURL=userActions.js.map