import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddressOfAuthenticatedUser, listAdress, listUsers, updateUser,  } from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post('/address',[authMiddleware],errorHandler(addAddress));
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRoutes.get("/address-auth", [authMiddleware], errorHandler(listAddressOfAuthenticatedUser));
usersRoutes.get("/address", [authMiddleware], errorHandler(listAdress));
usersRoutes.put("/",[authMiddleware],errorHandler(updateUser))

//metodos adicionales
usersRoutes.put('/:id/role',[authMiddleware,adminMiddleware], errorHandler(changeUserRole));
usersRoutes.get('/',[authMiddleware,adminMiddleware], errorHandler(listUsers));
usersRoutes.get('/:id',[authMiddleware,adminMiddleware], errorHandler(getUserById));

export default usersRoutes;