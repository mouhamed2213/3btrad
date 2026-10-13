import type { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger.js";
import { sucessRes } from "../../lib/api.response.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { MachineryService } from "./machinery.service.js";

export const MachineryController = {
  createMachine: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const machine = req.body;
      const result = await MachineryService.create(machine);
      logger.info("New machine ", result?.name, "added");
      sucessRes(res, result);
    },
  ),

  updateMachine: asyncHandler(async (req, res, next) => {
    const updatedMachine = req.body;
    const { id } = req.params;

    const result = await MachineryService.update(id as string, updatedMachine);
    logger.info(`Machine ${updatedMachine.id} updated`);
    sucessRes(res, result);
  }),

  getAll: asyncHandler(async (req, res, next) => {
    const result = await MachineryService.getAll();
    logger.info("Fetch all machine");
    sucessRes(res, result);
  }),

  getOne: asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const result = await MachineryService.getOne(id as string);
    logger.info(`Machine ${id} fetched`);
    sucessRes(res, result);
  }),

  delete: asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const result = await MachineryService.delete(id as string);
    logger.info(`Machine ${id} delete`);
    sucessRes(res, result);
  }),
};
