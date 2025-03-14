import { NextFunction, Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product, User } from "@prisma/client";
import { prismaClient } from "..";
import { json } from "stream/consumers";

export const addItemToCart = async (req:Request,res: Response) => {
    
    const validatedData = CreateCartSchema.parse(req.body);
    //revisamos la existencia del mismo producto
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id: validatedData.productId
                }
        })
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }
    const cart = await prismaClient.cartItem.create({
        data:{
            userId: (req.user as User).id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    //retornar respuesta

    res.json(cart);
    
}

export const deleteItemFormCart = async (req: Request, res: Response, next: NextFunction) => {
        const cartItem = await prismaClient.cartItem.findFirstOrThrow({
          where: {
            id: +req.params.id,
          }
        });
        if(!cartItem){
            next(new NotFoundException("Error CardItem no encontrado",ErrorCode.CART_NOT_FOUND))
        }
        await prismaClient.cartItem.delete({
            where:{
                id: +req.params.id
            }
        })
        res.json({success: true})
    
}

//metodo para cambiar la cantidad del card
export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);

    const updatedCart =  await prismaClient.cartItem.update({
        where:{
            id: +req.params.id
        },
        data:{
            quantity: validatedData.quantity
        }
    });
    res.json(updatedCart);
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where:{
            userId: (req.user as User).id
        },
        // fetch eager, incluye productos esta consulta
        include:{
            product: true
        }
    })
    res.json(cart);
}