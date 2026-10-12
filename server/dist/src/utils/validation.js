"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = exports.emailRegex = void 0;
exports.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
//# sourceMappingURL=validation.js.map