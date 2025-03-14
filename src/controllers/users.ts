import { NextFunction, Request, Response} from "express";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
//import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";
// import { User } from "@prisma/client";

export const addAddress = async (req:Request, res: Response) => {
    AddressSchema.parse(req.body);
    // let user: User;
    // try {
    //     user = await prismaClient.user.findFirstOrThrow({
    //         where:{
    //             id : req.body.userId
    //         }
    //     })
    // } catch (error) {
    //     throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    // }
    //console.log(user)

    //de esta manera es similar al auth.id() de laravel
    let usuario = req.user as User;
    console.log(usuario)
    const address =  await prismaClient.address.create({
        data:{
            ...req.body,
            userId: usuario.id
        }
    })
    res.json(address)
}
//el + sirve para convertir el valor a un numero
export const deleteAddress = async (req:Request, res: Response) => {

    try {
        await prismaClient.address.delete({
            where:{
                id: +req.params.id
            }
        });
        res.json({success: true});
    } catch (error) {
        throw new NotFoundException("Address Not Found Exception", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddressOfAuthenticatedUser = async (req: Request, res: Response) => {
    const listaDirecciones = await prismaClient.address.findMany({
        where:{
            userId: (req.user as User).id
        }
    })
    res.json(listaDirecciones);
};

export const listAdress = async (req: Request, res: Response) => {
    //equivalente al findAll de spring
    const listaDirecciones = await prismaClient.address.findMany();
    res.json(listaDirecciones);
}

//metodo para realizar una validacion por no hacer bien el prisma shcema
//un poco raro esto pero bueno
const validacionShippingOrBilling = async (req: Request,valorShippingOrBilling: number | undefined) => {
    let direccion: Address;
     if (valorShippingOrBilling) {
       try {
         direccion = await prismaClient.address.findFirstOrThrow({
           where: {
             id: valorShippingOrBilling,
           },
         });

        } catch (error) {
            throw new NotFoundException(
                "Address not found",
                ErrorCode.ADDRESS_NOT_FOUND
            );
        }
        //este if es para verificar que el usuario no utilize una direccion que no le pertenece
        if(direccion.userId !== (req.user as User).id){
           throw new BadRequestException("Address does not belong to user",ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
     }
}
//la verdad no tengo ni idea de este updateUser raro
export const updateUser = async(req: Request,res: Response,next: NextFunction) => {
    try{
        const validatedData = updateUserSchema.parse(req.body);
        await validacionShippingOrBilling(req, validatedData.defaultShippingAddress);
        await validacionShippingOrBilling(req, validatedData.defaultBillingAddress);
        const updatedUser = await prismaClient.user.update({
          where: {
            id: (req.user as User).id,
          },
          data: validatedData,
        });
        res.json(updatedUser);
    }catch(error){
        next(error);//para ir al middleware de error 
    }
}
// export const updateUser = async (req: Request, res: Response) => {
//   const validatedData = updateUserSchema.parse(req.body);
//   let shippingAddress: Address;
//   let billingAddress: Address;
//   console.log(validatedData);
//   if (validatedData.defaultShippingAddress) {
//     try {
//       shippingAddress = await prismaClient.address.findFirstOrThrow({
//         where: {
//           id: validatedData.defaultShippingAddress,
//         },
//       });
//     } catch (error) {
//       throw new NotFoundException(
//         "Address not found.",
//         ErrorCode.ADDRESS_NOT_FOUND
//       );
//     }
//     //validacion para verificar que la direccion pertenezca al usuario
//     //casi no se a que se refiere
//     if (shippingAddress.userId != (req.user as User).id) {
//       throw new BadRequestException(
//         "Address does not belong to user",
//         ErrorCode.ADDRESS_DOES_NOT_BELONG
//       );
//     }
//   }
//   if (validatedData.defaultBillingAddress) {
//     try {
//       billingAddress = await prismaClient.address.findFirstOrThrow({
//         where: {
//           id: validatedData.defaultBillingAddress,
//         },
//       });
//     } catch (error) {
//       throw new NotFoundException(
//         "Address not found.",
//         ErrorCode.ADDRESS_NOT_FOUND
//       );
//     }
//     if (billingAddress.userId != (req.user as User).id) {
//       throw new BadRequestException(
//         "Address does not belong to user",
//         ErrorCode.ADDRESS_DOES_NOT_BELONG
//       );
//     }
//   }

//   const updatedUser = await prismaClient.user.update({
//     where: {
//       id: (req.user as User).id,
//     },
//     data: validatedData,
//   });
//   res.json(updatedUser);
// };