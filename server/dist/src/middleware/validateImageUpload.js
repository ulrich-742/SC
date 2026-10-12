"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageUpload = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
function hasValidMagic(bytes) {
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const webp = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
    return jpeg || png || webp;
}
const validateImageUpload = async (req, res, next) => {
    if (!req.file)
        return next();
    try {
        const handle = await promises_1.default.open(req.file.path, "r");
        const bytes = Buffer.alloc(12);
        await handle.read(bytes, 0, 12, 0);
        await handle.close();
        if (!hasValidMagic(bytes)) {
            await promises_1.default.unlink(req.file.path).catch(() => undefined);
            return res.status(415).json({ message: "Le fichier n'est pas une image JPEG, PNG ou WebP valide" });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateImageUpload = validateImageUpload;
//# sourceMappingURL=validateImageUpload.js.map