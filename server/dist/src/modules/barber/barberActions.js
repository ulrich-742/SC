"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import access to data
const barberRepository_1 = __importDefault(require("./barberRepository"));
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
    try {
        // Fetch all barbers
        const { startDate, endDate } = req.query;
        const barbers = await barberRepository_1.default.readAll({
            startDate: typeof startDate === "string" ? startDate : undefined,
            endDate: typeof endDate === "string" ? endDate : undefined,
        });
        // Respond with the barbers in JSON format
        res.json(barbers);
    }
    catch (err) {
        // Pass any errors to the error-handling middleware
        next(err);
    }
};
// Le R de BREAD - Read (Read One) operation
const read = async (req, res, next) => {
    try {
        // 1. On récupère l'id depuis les paramètres de la route (ex: /api/barbers/4)
        const id = Number(req.params.id);
        // 2. On appelle notre méthode du repository
        const barber = await barberRepository_1.default.read(id);
        // 3. Si on ne trouve pas le barbier, on renvoie une erreur 404
        if (barber == null) {
            res.sendStatus(404);
        }
        else {
            // Sinon, on répond avec le barbier au format JSON
            res.json(barber);
        }
    }
    catch (err) {
        next(err);
    }
};
const edit = async (req, res, next) => {
    try {
        const id_user = Number(req.params.id);
        const updatedCustomerData = { ...req.body, id_user };
        if (req.user?.id !== Number(req.params.id) && req.user?.role !== "admin") {
            return res.sendStatus(403);
        }
        // Appel au repository pour sauvegarder en BDD
        await barberRepository_1.default.update(updatedCustomerData);
        // On renvoie un statut 200 avec les données
        res.status(200).json({
            message: "Client mis à jour avec succès",
            data: updatedCustomerData,
        });
    }
    catch (err) {
        next(err);
    }
};
const readPortfolio = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const portfolio = await barberRepository_1.default.readPortfolio(id);
        res.json(portfolio);
    }
    catch (err) {
        next(err);
    }
};
// On n'oublie pas d'exposer "read" ici pour le routeur !
exports.default = { browse, read, edit, readPortfolio };
//# sourceMappingURL=barberActions.js.map