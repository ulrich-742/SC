// Load the express module to create a web application
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import databaseClient from "../database/client";

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Configure it

/* ************************************************************************* */

// CORS Handling: Why is the current code present and do I need to define specific allowed origins for my project?

// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:

// app.use(cors());

// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code allows CLIENT_URL in development mode (when process.env.CLIENT_URL is defined).

import cors from "cors";

if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
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

app.use(express.json({ limit: "100kb" }));

// app.use(express.urlencoded());
// app.use(express.text());
// app.use(express.raw());

/* ************************************************************************* */

// Import the API router
import router from "./router";
import routerAdmin from "./routerAdmin";
import routerBarber from "./routerBarber";

app.get("/health", async (_req, res) => {
  try {
    await databaseClient.query("SELECT 1");
    res.json({ status: "ok", api: "ok", database: "ok", environment: process.env.NODE_ENV ?? "development" });
  } catch {
    res.status(503).json({ status: "degraded", api: "ok", database: "unavailable", environment: process.env.NODE_ENV ?? "development" });
  }
});

app.use(
  ["/api/login", "/api/register", "/api/forgot-password"],
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false }),
);

// Mount the API router under the "/api" endpoint
app.use(router);
app.use("/api/admin", routerAdmin);
app.use("/api/barber", routerBarber);

/* ************************************************************************* */

// Production-ready setup: What is it for?

// The code includes sections to set up a production environment where the client and server are executed from the same processus.

// What it's for:
// - Serving client static files from the server, which is useful when building a single-page application with React.
// - Redirecting unhandled requests (e.g., all requests not matching a defined API route) to the client's index.html. This allows the client to handle client-side routing.

import fs from "node:fs";
import path from "node:path";
const projectRoot = path.basename(process.cwd()).toLowerCase() === "server"
  ? path.resolve(process.cwd(), "..")
  : process.cwd();

// Serve uploaded files
const uploadsFolderPath = path.resolve(projectRoot, "server/public/uploads");
if (fs.existsSync(uploadsFolderPath)) {
  app.use("/uploads", express.static(uploadsFolderPath));
}

// Serve server resources

const publicFolderPath = path.resolve(projectRoot, "server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

// Serve client resources

const clientBuildPath = path.resolve(projectRoot, "client/dist");

app.use("/api", (_req, res) => res.status(404).json({ message: "Route API introuvable" }));

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // Redirect unhandled requests to the client index file

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* ************************************************************************* */

// Middleware for Error Logging
// Important: Error-handling middleware should be defined last, after other app.use() and routes calls.

import type { ErrorRequestHandler } from "express";

// Define a middleware function to log errors
const logErrors: ErrorRequestHandler = (err, req, res, _next) => {
  const error = err as { code?: string; message?: string; status?: number };
  if (res.headersSent) return;
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

export default app;
