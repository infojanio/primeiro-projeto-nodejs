"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var upload_1 = __importDefault(require("@config/upload"));
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
var routes_1 = __importDefault(require("./routes"));
require("@shared/infra/typeorm");
require("@shared/container");
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/files', express_1.default.static(upload_1.default.uploadsFolder)); // rota para mostrar o avatar
app.use(routes_1.default);
// Temos que fazer a tratativa de erros após as rotas
app.use(function (err, request, response, next) {
    if (err instanceof AppError_1.default) {
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
});
app.get('/', function (request, response) {
    return response.json({ Message: 'hello Go Stack' });
});
app.listen(3333, function () {
    console.log('Servidor funcionando!');
});
