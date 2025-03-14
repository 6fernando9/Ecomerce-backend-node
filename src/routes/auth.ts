import { Router } from "express";
import { getJsonAuthenticatedUser, login, signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router();
//ACA DEFINIMOS LAS RUTAS Y EL QUE HACE, COMO LARAVEL
//definimos una ruta /login, donde se ejecuta un metodo de un controlador, en este caso el metodo login
//error handler por si ocurre algun error mandara una exception 500 de internal server error
authRoutes.post('/login',errorHandler(login));
authRoutes.post("/signup", errorHandler(signup));
authRoutes.get("/me", [authMiddleware], errorHandler(getJsonAuthenticatedUser));

export default authRoutes;