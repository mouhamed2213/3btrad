import cors from "cors";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import { logger } from "./config/logger.js";

const app: Express = express();

// Middlewares de base
app.use(cors());
app.use(express.json());

// Log HTTP avec Morgan redirigé vers Winston
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

// Healthcheck Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Middleware Global de Gestion d'Erreur (Fallback)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "InternalServerError",
    message: err.message || "Une erreur interne est survenue",
  });
});

export default app;
