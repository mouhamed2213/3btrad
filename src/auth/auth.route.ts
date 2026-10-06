import express from "express";
import { validate } from "../common/zod.validator.js";
import { AuthContrloller } from "./auth.controller.js";
import { registerSchema } from "./auth.schema.js";

const authRouter = express.Router();

// router.post("/login", login);
authRouter.post(
  "/register",
  validate(registerSchema),
  AuthContrloller.register,
);

export default authRouter;
