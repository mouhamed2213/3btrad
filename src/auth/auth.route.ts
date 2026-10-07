import express from "express";
import { AuthContrloller } from "./auth.controller.js";

const authRouter = express.Router();

// router.post("/login", login);
authRouter.post("/register", AuthContrloller.register);
authRouter.post("/login", AuthContrloller.login);



export default authRouter;
