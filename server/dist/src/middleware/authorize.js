"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrAdmin = exports.requireRole = void 0;
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user)
        return res.sendStatus(401);
    if (!roles.includes(req.user.role))
        return res.sendStatus(403);
    next();
};
exports.requireRole = requireRole;
const requireSelfOrAdmin = (param = "id") => (req, res, next) => {
    if (!req.user)
        return res.sendStatus(401);
    const resourceOwnerId = Number(req.params[param]);
    if (!Number.isInteger(resourceOwnerId)) {
        return res.status(400).json({ message: "Identifiant invalide" });
    }
    if (req.user.role !== "admin" && req.user.id !== resourceOwnerId) {
        return res.sendStatus(403);
    }
    next();
};
exports.requireSelfOrAdmin = requireSelfOrAdmin;
//# sourceMappingURL=authorize.js.map