"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load the express module to create a web application
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const client_1 = __importDefault(require("../database/client"));
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// Configure it
/* ************************************************************************* */
// CORS Handling: Why is the current code present and do I need to define specific allowed origins for my project?
// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:
// app.use(cors());
// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code allows CLIENT_URL in development mode (when process.env.CLIENT_URL is defined).
const cors_1 = __importDefault(require("cors"));
if (process.env.CLIENT_URL != null) {
    app.use((0, cors_1.default)({ origin: [process.env.CLIENT_URL] }));
}
// If you need to allow extra origins, you can add something like this:
/*
app.use(
  cors({
    origin: ["http://mysite.com", "http://another-domain.com"],
  }),
);
*/
// With ["http://mysite.com", "http://another-domain.com"]
// to be replaced with an array of your trusted origins
/* ************************************************************************* */
// Request Parsing: Understanding the purpose of this part
// Request parsing is necessary to extract data sent by the client in an HTTP request.
// For example to access the body of a POST request.
// The current code contains different parsing options as comments to demonstrate different ways of extracting data.
// 1. `express.json()`: Parses requests with JSON data.
// 2. `express.urlencoded()`: Parses requests with URL-encoded data.
// 3. `express.text()`: Parses requests with raw text data.
// 4. `express.raw()`: Parses requests with raw binary data.
// Uncomment one or more of these options depending on the format of the data sent by your client:
app.use(express_1.default.json({ limit: "100kb" }));
// app.use(express.urlencoded());
// app.use(express.text());
// app.use(express.raw());
/* ************************************************************************* */
// Import the API router
const router_1 = __importDefault(require("./router"));
const routerAdmin_1 = __importDefault(require("./routerAdmin"));
const routerBarber_1 = __importDefault(require("./routerBarber"));
app.get("/health", async (_req, res) => {
    try {
        await client_1.default.query("SELECT 1");
        res.json({ status: "ok", api: "ok", database: "ok", environment: process.env.NODE_ENV ?? "development" });
    }
    catch {
        res.status(503).json({ status: "degraded", api: "ok", database: "unavailable", environment: process.env.NODE_ENV ?? "development" });
    }
});
app.use(["/api/login", "/api/register", "/api/forgot-password"], (0, express_rate_limit_1.rateLimit)({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false }));
// Mount the API router under the "/api" endpoint
app.use(router_1.default);
app.use("/api/admin", routerAdmin_1.default);
app.use("/api/barber", routerBarber_1.default);
/* ************************************************************************* */
// Production-ready setup: What is it for?
// The code includes sections to set up a production environment where the client and server are executed from the same processus.
// What it's for:
// - Serving client static files from the server, which is useful when building a single-page application with React.
// - Redirecting unhandled requests (e.g., all requests not matching a defined API route) to the client's index.html. This allows the client to handle client-side routing.
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const projectRoot = node_path_1.default.basename(process.cwd()).toLowerCase() === "server"
    ? node_path_1.default.resolve(process.cwd(), "..")
    : process.cwd();
// Serve uploaded files
const uploadsFolderPath = node_path_1.default.resolve(projectRoot, "server/public/uploads");
if (node_fs_1.default.existsSync(uploadsFolderPath)) {
    app.use("/uploads", express_1.default.static(uploadsFolderPath));
}
// Serve server resources
const publicFolderPath = node_path_1.default.resolve(projectRoot, "server/public");
if (node_fs_1.default.existsSync(publicFolderPath)) {
    app.use(express_1.default.static(publicFolderPath));
}
// Serve client resources
const clientBuildPath = node_path_1.default.resolve(projectRoot, "client/dist");
app.use("/api", (_req, res) => res.status(404).json({ message: "Route API introuvable" }));
if (node_fs_1.default.existsSync(clientBuildPath)) {
    app.use(express_1.default.static(clientBuildPath));
    // Redirect unhandled requests to the client index file
    app.get("*", (_, res) => {
        res.sendFile("index.html", { root: clientBuildPath });
    });
}
// Define a middleware function to log errors
const logErrors = (err, req, res, _next) => {
    const error = err;
    if (res.headersSent)
        return;
    if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ message: "Fichier trop volumineux" });
        return;
    }
    if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "Cette ressource existe déjà" });
        return;
    }
    if (error.status && error.status >= 400 && error.status < 500) {
        res.status(error.status).json({ message: error.message ?? "Requête invalide" });
        return;
    }
    console.error(`[${req.method} ${req.path}]`, error.code ?? error.message ?? "Erreur inconnue");
    res.status(500).json({ message: "Erreur interne du serveur" });
};
// Mount the logErrors middleware globally
app.use(logErrors);
/* ************************************************************************* */
exports.default = app;
//# sourceMappingURL=app.js.map