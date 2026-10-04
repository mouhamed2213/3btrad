export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Subclasses utilitaires pour plus de lisibilité dans le code métier
export class NotFoundError extends AppError {
  constructor(message: string = "Ressource introuvable") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Requête invalide") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Accès non autorisé") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Action interdite") {
    super(message, 403);
  }
}
