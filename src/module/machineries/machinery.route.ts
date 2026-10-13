import express from "express";
import { MachineryController } from "./machinery.controller.js";

const machineryRoute = express.Router();

// protect route
machineryRoute.post("/create", MachineryController.createMachine);
machineryRoute.get("/", MachineryController.getAll);
machineryRoute.get("/:id", MachineryController.getOne);
machineryRoute.patch("/:id", MachineryController.updateMachine);
machineryRoute.delete("/:id", MachineryController.delete);

export default machineryRoute;
