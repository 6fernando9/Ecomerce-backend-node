import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

//para escuchar errores, por si ocurre algun error se redirige a la excepcion, donde se dispara el middleware
export const errorHandler = (method: AsyncHandler) =>{
    return async (req: Request, res: Response,next: NextFunction) =>{
        try {
            await method(req,res,next)
        } catch (error: any) {
            let exception: HttpException ;
            if(error instanceof HttpException){
                exception = error;
            }else{
                if(error instanceof ZodError){
                    exception = new BadRequestException("UnProcessableEntity", ErrorCode.UNPROCESABLE_ENTITY);
                }
                exception = new InternalException('Something went wrong!', error,ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    }
}