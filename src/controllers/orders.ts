import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { User } from "@prisma/client";

export const createOrder = async(req: Request, res: Response) => {
    
    //5.  to define computed field for formatted address on address module
  
    //1. creamos la transaccion
    return await prismaClient.$transaction(async(tx) => {
      //2.  listamos todo los item del card
      const cartItems = await tx.cartItem.findMany({
        where: {
          userId: (req.user as User).id,
        },
        include: {
          product: true,
        },
      });
      //2.1 y procedemos si el carrito no esta vacio
      if (cartItems.length === 0) {
        res.json({ message: "cart is empty" });
        return;
      }

      //3. calculamos el monto total a cancelar
      //valor previo comienza en 0 o "prev", y va sumando el precio de cada producto
      const price = cartItems.reduce((prev, current) => {
        return prev + current.quantity * +current.product.price;
      }, 0);

      //4. fetch la direccion del usuario
      const address = await tx.address.findFirst({
        where: {
          id: (req.user as User).defaultShippingAddress!,
        },
      });

      //6. we will create a order an order productOrder products
      //seteamos el objeto noda de venta o order
      const order = await tx.order.create({
        data: {
          userId: (req.user as User).id,
          netAmount: price,
          address: address!.formattedAddress,
          products: {
            create: cartItems.map((cart) => {
              return {
                productId: cart.productId,
                quantity: cart.quantity,
              };
            }),
          },
        },
      });

      //7. create event
      const orderEvent = await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      // 8 vaciamos el carrito
      await tx.cartItem.deleteMany({
        where: {
          userId: (req.user as User).id,
        },
      });
      res.json(order);
    })
}

// export const createOrder = async (req: Request, res: Response) => {
//   await prismaClient.$transaction(async (tx) => {
//     const cartItems = await tx.cartItem.findMany({
//       where: { userId: (req.user as User).id },
//       include: { product: true },
//     });

//     if (cartItems.length === 0) {
//       res.json({ message: "cart is empty" });
//       return;
//     }

//     const price = cartItems.reduce(
//       (prev, current) => prev + current.quantity * +current.product.price,
//       0
//     );

//     const address = await tx.address.findFirst({
//       where: { id: (req.user as User).defaultShippingAddress! },
//     });

//     const order = await tx.order.create({
//       data: {
//         userId: (req.user as User).id,
//         netAmount: price,
//         address: address!.formattedAddress,
//         products: {
//           create: cartItems.map((cart) => ({
//             productId: cart.productId,
//             quantity: cart.quantity,
//           })),
//         },
//       },
//     });

//     await tx.orderEvent.create({ data: { orderId: order.id } });

//     await tx.cartItem.deleteMany({ where: { userId: (req.user as User).id } });

//     res.json(order); // Aquí ya no es necesario return
//   });
// };

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where:{
      userId: (req.user as User).id    }
  })
  res.json(orders);
};
export const cancelOrder = async (req: Request, res: Response) => {
  // 1 Wrap it inside transaction
  //2 check if the users is cancelling its own order
  try {
    //actualizamos el objeto orden a cancelado
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id,
      },
      data:{
        status: 'CANCELLED'
      }
    });
    //
    await prismaClient.orderEvent.create({
      data:{
        orderId: order.id,
        status: "CANCELLED"
      }
    })
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where:{
        id: +req.params.id
      },
      include:{
        products: true,
        events: true
      }
    })
    res.json(order)
  } catch (error) {
    throw new NotFoundException('Order not found',ErrorCode.ORDER_NOT_FOUND);
  }
};

//listar las ordenes por estado
export const listAllOrders = async (req:Request,res:Response) => {
    let whereClause = {};
    const status = req.query.status;
    console.log("Entre al lisAllOrders")
    if(status){
      whereClause = {
        status
      }
    }
    //en este caso usamos un where personalizado, donde lo va armando
    const orders = await prismaClient.order.findMany({
      where: whereClause,
      skip: +req.query.skip! || 0,
      take: 5
    })
    res.json(orders);
}
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order =  await prismaClient.order.update({
      where: {
        id: +req.params.id
      },
      data:{
        status: req.body.status
      }
    });
    await prismaClient.orderEvent.create({
      data:{
        orderId: order.id,
        status: req.body.status
      }
    })
    res.json(order)
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
  }
};
export const listUsersOrders = async (req: Request, res: Response) => {
   let whereClause: any = {
    userId: +req.params.id
   };
   const status = req.params.status;
   if (status) {
     whereClause = {
       ...whereClause,
       status
     };
   }
   //en este caso usamos un where personalizado, donde lo va armando
   const orders = await prismaClient.order.findMany({
     where: whereClause,
     skip: +req.query.skip! || 0,
     take: 5,
   });
   res.json(orders);
};