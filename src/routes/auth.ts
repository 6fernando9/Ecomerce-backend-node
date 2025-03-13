import { Router } from "express";
import { login, signup } from "../controllers/auth";

const authRoutes: Router = Router();

//definimos una ruta /login, donde se ejecuta un metodo de un controlador, en este caso el metodo login
authRoutes.get('/login',login);
authRoutes.post("/signup", signup);

export default authRoutes;