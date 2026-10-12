"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEventImage = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const multer_1 = __importDefault(require("multer"));
const uploadsDir = node_path_1.default.join(__dirname, "../../../../server/public/uploads/events");
if (!node_fs_1.default.existsSync(uploadsDir)) {
    node_fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname).toLowerCase();
        const eventId = req.params.id || "new";
        cb(null, `event-${eventId}-${(0, node_crypto_1.randomUUID)()}${ext}`);
    },
});
exports.uploadEventImage = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        cb(null, allowed.includes(file.mimetype));
    },
});
//# sourceMappingURL=eventUpload.js.map