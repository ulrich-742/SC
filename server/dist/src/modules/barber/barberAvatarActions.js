"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.upload = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const multer_1 = __importDefault(require("multer"));
const client_1 = __importDefault(require("../../../database/client"));
const uploadsDir = node_path_1.default.join(__dirname, "../../../../server/public/uploads/avatars");
if (!node_fs_1.default.existsSync(uploadsDir)) {
    node_fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `barber-${req.params.id}-${(0, node_crypto_1.randomUUID)()}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        cb(null, allowed.includes(file.mimetype));
    },
});
const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        if (Number(req.params.id) !== req.user.id) {
            return res.sendStatus(403);
        }
        if (!req.file) {
            res.status(400).json({ error: "Aucun fichier fourni" });
            return;
        }
        const barberId = req.user.id;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        await client_1.default.query("UPDATE users SET avatar_url = ? WHERE id_user = ?", [avatarUrl, barberId]);
        res.json({ avatar_url: avatarUrl });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=barberAvatarActions.js.map