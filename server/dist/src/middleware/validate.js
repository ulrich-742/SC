"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Données invalides",
            errors: parsed.error.issues.map(({ path, message }) => ({ path, message })),
        });
    }
    req.body = parsed.data;
    next();
};
exports.validateBody = validateBody;
//# sourceMappingURL=validate.js.map