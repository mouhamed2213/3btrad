import { Prisma } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../common/app-error.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Une erreur interne est survenue";
  let errors: any = undefined;

  // 1. Gestion des erreurs métier personnalisées (AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // 2. Gestion des erreurs de validation Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Données de requête invalides";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }
  // 3. Gestion des erreurs Prisma (Base de données)
//   else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === "P2002") {
//       statusCode = 409;
//       message =
//         "Une contrainte d'unicité a été violée (enregistrement déjà existant)";
//     } else if (err.code === "P2025") {
//       statusCode = 404;
//       message = "L'enregistrement cible n'a pas été trouvé";
//     } else {
//       statusCode = 400;
//       message = `Erreur de base de données (Code: ${err.code})`;
//     }
//   }

  // Log de l'erreur via Winston
  if (statusCode >= 500) {
    logger.error("CRITICAL ERROR: %o", {
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn("OPERATIONAL ERROR: %o", { statusCode, message, errors });
  }

  // Format de réponse JSON uniformisé
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
