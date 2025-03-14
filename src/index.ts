import express, {Express,Request,Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
// import productRoutes from './routes/products';

//instanciamos a express
const app:Express = express();

app.use(express.json());//para acceder al cuerpo de la peticion,si no se coloca esto es undefined

// app.get('/',(req: Request,res: Response) => {
//     res.send('Working');

// })

//ap.use, el "use" define prefijos de rutas al enrutador root Router
app.use('/api', rootRouter);
// app.use("/api", productRoutes);

//Cliente Prisma
//donde tambien activamos los logs
export const prismaClient = new PrismaClient({
    log:['query']
})
//extends se usa para agregar validaciones a metodos 
// }).$extends({
//     query:{ //modificamos una consulta prisma
//         user:{ //a este modelo de prisma
//             //validacion 
//             create({args,query}){// modificamos este comportamiento
//                 args.data = signupSchema.parse(args.data)
//                 return query(args); //query permite ejecutar la consulta con esos daots
//             }
//         }
//     }
// }); 

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
