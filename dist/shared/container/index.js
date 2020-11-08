"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
require("@modules/users/providers");
require("./providers");
var AppointmentsRepository_1 = __importDefault(require("@modules/appointments/infra/typeorm/repositories/AppointmentsRepository"));
var UsersRepository_1 = __importDefault(require("@modules/users/infra/typeorm/repositories/UsersRepository"));
var UserTokensRepository_1 = __importDefault(require("@modules/users/infra/typeorm/repositories/UserTokensRepository"));
tsyringe_1.container.registerSingleton(// O register Singleton instância a classe 1 única vez
'AppointmentsRepository', AppointmentsRepository_1.default);
tsyringe_1.container.registerSingleton(// O register Singleton instância a classe 1 única vez
'UsersRepository', UsersRepository_1.default);
tsyringe_1.container.registerSingleton(// O register Singleton instância a classe 1 única vez
'UserTokensRepository', UserTokensRepository_1.default);
