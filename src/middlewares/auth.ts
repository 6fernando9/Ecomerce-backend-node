import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../secrets";
import { prismaClient } from "..";

//este metodo se ejecutara cuando se lo llame
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //1.- primero extraemos el token del header
    const token = req.headers.authorization;

    //2.- si el token no esta presente, lanzamos un error
    if(!token){
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }

    try {
      //3.- si el token esta presente, verificar que el token y el extrae el payload
      const payload = jwt.verify(token!, JWT_SECRET_KEY) as any;

      //4.- obtiene el usuario del payload
      const user = await prismaClient.user.findFirst({
        where: { id: payload.userId },
      });
      if (!user) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
        return;
      }

      // 5. to attach the user to the current request obejct
      req.user = user;
      next();//que vaya al sgte middleware
    } catch (error) {
        next(new UnauthorizedException('Unauthorized',ErrorCode.UNAUTHORIZED));
    }

}
export default authMiddleware;