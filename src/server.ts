import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); //rota para mostrar o avatar
app.use(routes);

//Temos que fazer a tratativa de erros após as rotas
app.use((err:Error, request:Request, response:Response, next:NextFunction) => {
if (err instanceof AppError) {
    //retorna erro gerando dentro de nossa API
    return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        });
        }
        
        //retorna erro inesperado de fora de nossa API 
        console.error(err);
        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    },
); 

app.get('/', (request, response)=> {
return response.json({Message: "hello Go Stack"});
});

app.listen(3333, ()=> {
    console.log("Servidor funcionando!");
});
