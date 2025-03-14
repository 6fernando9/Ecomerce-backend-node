import { NextFunction,Request,Response } from "express";
import { HttpException } from "../exceptions/root";

//parece que es aqui donde viene para generar el json del error
//recibe el objeto error, el req y response, el nextFunction no se muy bien para que es
export const errorMiddleware = (error: HttpException,req: Request, res: Response,next: NextFunction) => {
    res.status(error.statusCode).json({
        message: error.message,
        ErrorCode: error.errorCode,
        errors:error.errors,
    })
}