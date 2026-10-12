"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }
    const token = auth.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: payload.id,
            role: payload.role,
        };
        next();
    }
    catch {
        return res.sendStatus(401);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map