import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddressOfAuthenticatedUser, listAdress, updateUser,  } from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post('/address',[authMiddleware],errorHandler(addAddress));
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get("/address-auth", [authMiddleware], errorHandler(listAddressOfAuthenticatedUser));
usersRoutes.get("/address", [authMiddleware], errorHandler(listAdress));
usersRoutes.put("/",[authMiddleware],errorHandler(updateUser))
export default usersRoutes;