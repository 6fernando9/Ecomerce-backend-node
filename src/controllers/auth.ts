//controlador para manejar las solicitudes y respuesta
import { NextFunction, request, Request,Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { signupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { User } from "@prisma/client";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException("User Not Found", ErrorCode.USER_NOT_FOUND);
  }
  //comparamos contrasenias
  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Incorrect Password",
      ErrorCode.INCORREC_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET_KEY
  );

  res.json({ user, token }); //devolvemos un json conformado por 2 objetos
};
//el next es para que lo capture el middleware
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    // se desactiva el try catch para no tener un error por cada metodo
    //para eso esta el handler Exception
   // try {
        signupSchema.parse(req.body);//validamos la entrada del request
        const {email, password, name} = req.body;
        let user = await prismaClient.user.findFirst({ where: { email } });
        if( user ){
            next(new BadRequestException("User not found!",ErrorCode.USER_ALREADY_EXISTS));
        }
    
        user = await prismaClient.user.create({
            data:{
                name,
                email,
                password: hashSync(password,10)
            }
        })
    
        res.json(user);
    // } catch (error: any) {
    //     next( new UnprocessableEntity(error?.cause?.issues,'Unprocessable Entity',ErrorCode.UNPROCESABLE_ENTITY));
    // }

}

//obtener usuario autenticado
export const getJsonAuthenticatedUser = async (req: Request,res: Response) => {
     res.json(req.user)
}

export const getAuthenticatedUser = (req: Request, res: Response): User => {
  if(!req.user){
    throw new UnauthorizedException("Error Usuario no Authenticado",ErrorCode.UNAUTHORIZED);
  }
  return req.user as User;
}