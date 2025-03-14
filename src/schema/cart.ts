import { z } from 'zod'
//es como una validacion que se hace para las entradas de los datos
export const CreateCartSchema = z.object({
    productId: z.number(),
    quantity: z.number()
})

export const ChangeQuantitySchema = z.object({
    quantity: z.number()
})