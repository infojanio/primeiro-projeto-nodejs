import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder)); // rota para mostrar o avatar

app.use(rateLimiter); // limita qtd requisições das rotas que vem abaixo
app.use(routes);

app.use(errors()); // mostra erros ocorridos na validação das rotas

// Temos que fazer a tratativa de erros após as rotas
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      // retorna erro gerado dentro de nossa API
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    // retorna erro inesperado de fora de nossa API
    console.error(err);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.get('/', (request, response) => {
  return response.json({ Message: 'hello Go Stack' });
});

app.listen(3333, () => {
  console.log('Servidor funcionando!');
});
