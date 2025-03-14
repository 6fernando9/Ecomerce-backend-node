import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productRoutes: Router = Router();

// rutas del crud  SIMILAR A LARAVEL

productRoutes.post('/',[authMiddleware, adminMiddleware],errorHandler(createProduct));
//para mandar id se utiliza el :id
productRoutes.put('/:id',[authMiddleware,adminMiddleware],errorHandler(updateProduct));
productRoutes.delete('/:id',[authMiddleware,adminMiddleware],errorHandler(deleteProduct));
productRoutes.get('/',[authMiddleware,adminMiddleware],errorHandler(listProducts));
productRoutes.get('/:id',[authMiddleware,adminMiddleware],errorHandler(getProductById));

export default productRoutes;