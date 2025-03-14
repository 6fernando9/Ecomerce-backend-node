import { z } from 'zod'
//es como una validacion que se hace para las entradas de los datos
export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})