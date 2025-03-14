import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";
import usersRoutes from "./user";
import cartRoutes from "./cart";
//otra capa para administrar los endpoind
const rootRouter: Router = Router();

//el "use" lo que hace es como un request mapping
//es como que agrupasemos todo que empieze con /auth
rootRouter.use('/auth',authRoutes);
rootRouter.use('/products',productRoutes)
rootRouter.use("/users", usersRoutes);
rootRouter.use("/carts",cartRoutes);
export default rootRouter;