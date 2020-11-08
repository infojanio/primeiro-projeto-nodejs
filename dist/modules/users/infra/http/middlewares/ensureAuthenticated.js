"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = __importDefault(require("@config/auth"));
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
function ensureAuthenticated(request, response, next) {
    var authHeader = request.headers.authorization; // pega o token dentro do Header
    if (!authHeader) {
        throw new AppError_1.default('JWT token não autenticado!', 401);
    }
    var _a = authHeader.split(' '), token = _a[1];
    try {
        var decoded = jsonwebtoken_1.verify(token, auth_1.default.jwt.secret);
        // pega o id de usuário para ser usado em todas as rotas autenticadas
        var sub = decoded.sub; // forçando a variável p/ o tipo TokenPayLoad
        request.user = {
            // precisamos subscrever na lib express o user
            id: sub,
        };
        // console.log(decoded);
        return next();
    }
    catch (_b) {
        throw new AppError_1.default('JWT Token inválido!', 401);
    }
}
exports.default = ensureAuthenticated;
