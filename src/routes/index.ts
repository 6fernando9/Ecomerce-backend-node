import { Router } from "express";
import authRoutes from "./auth";

const rootRouter: Router = Router();

//el "use" lo que hace es como un request mapping
//es como que agrupasemos todo que empieze con /auth
rootRouter.use('/auth',authRoutes);

export default rootRouter;