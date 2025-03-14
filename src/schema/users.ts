import { z } from 'zod'
//es como una validacion que se hace para las entradas de los datos
export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

//validaciones de tipos de datos de address
export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string(),
    userId: z.number(),
})