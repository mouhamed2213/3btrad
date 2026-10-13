import { Router } from "express";
import authRouter from "./module/auth/auth.route.js";
import machineryRoute from "./module/machineries/machinery.route.js";

const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/machine", machineryRoute);

export default apiRouter;
