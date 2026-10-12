"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const client_1 = __importDefault(require("../../database/client"));
const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Non authentifié" });
        }
        const [rows] = await client_1.default.query("SELECT 1 FROM admin WHERE id_user = ?", [
            userId,
        ]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res
                .status(403)
                .json({ message: "Accès refusé : Vous n'êtes pas un administrateur" });
        }
        next();
    }
    catch (error) {
        console.error("Erreur dans verifyAdmin:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.verifyAdmin = verifyAdmin;
//# sourceMappingURL=verifyAdmin.js.map