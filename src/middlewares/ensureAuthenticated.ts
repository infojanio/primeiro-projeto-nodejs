import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayLoad {
    iat: number;
    exp: number;
    sub: string;
}
export default function ensureAuthenticated (
    request:Request, 
    response:Response, 
    next:NextFunction): void {

        const authHeader = request.headers.authorization; //pega o token dentro do Header

        if(!authHeader) {
            throw new AppError ('JWT token não autenticado!', 401);
        }

        const [, token] = authHeader.split(' ');
        
        try {
        const decoded = verify(token, authConfig.jwt.secret);

        //pega o id de usuário para ser usado em todas as rotas autenticadas
        const { sub } = decoded as TokenPayLoad; //forçando a variável p/ o tipo TokenPayLoad
        request.user = { //precisamos subscrever na lib express o user
            id: sub,
        };
        //console.log(decoded);
        return next();
        } 
        catch {
            throw new AppError ('JWT Token inválido!', 401);
        } 
}
