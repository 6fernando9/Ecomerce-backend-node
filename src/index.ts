import express, {Express,Request,Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';

const app:Express = express();

app.use(express.json());//para acceder al cuerpo de la peticion,si no se coloca esto es undefined

app.get('/',(req: Request,res: Response) => {
    res.send('Working');

})

//ap.use, el "use" define prefijos de rutas al enrutador root Router
app.use('/api', rootRouter);

//Cliente Prisma
export const prismaClient = new PrismaClient({
    log:['query']
}); 

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
