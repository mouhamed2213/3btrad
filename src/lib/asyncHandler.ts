import type { NextFunction, Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  // This middleware function wraps the provided requestHandler in a Promise
  // and catches any errors that may occur during its execution.
  return (req: Request, res: Response, next: NextFunction) => {
    // Resolve the Promise with the result of the requestHandler
    Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // Catch any errors and pass them to the next middleware
  };
};
