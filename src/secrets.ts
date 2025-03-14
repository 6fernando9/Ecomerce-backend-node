import dotenv from 'dotenv'
//para las rutas
// import path from 'path'

//carga las variables de entorno definidas en el archivo .env, donde especificamos la ruta con el objeto que tiene atributo path
dotenv.config({path: '.env'})

//exportaremos esta variable para que sea accesible
export const PORT = process.env.PORT;
//signo de exclamasion para decir que esta variable nunca sera undefined
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
