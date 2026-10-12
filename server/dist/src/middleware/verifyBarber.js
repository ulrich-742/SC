"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBarber = void 0;
const verifyBarber = (req, res, next) => {
    if (req.user?.role !== "barber") {
        return res.sendStatus(403);
    }
    next();
};
exports.verifyBarber = verifyBarber;
//# sourceMappingURL=verifyBarber.js.map