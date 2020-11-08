"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var ProvidersControllers_1 = __importDefault(require("../controllers/ProvidersControllers"));
var providersRouter = express_1.Router();
var providersController = new ProvidersControllers_1.default();
providersRouter.use(ensureAuthenticated_1.default); // consulta se o token é válido em todas as rotas
providersRouter.get('/', providersController.index);
exports.default = providersRouter;
