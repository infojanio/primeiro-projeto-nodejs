"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
var FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
var FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
var UpdateProfileService_1 = __importDefault(require("./UpdateProfileService"));
var fakeUsersRepository; // criação de repositorio fake
var fakeHashProvider;
var updateProfile;
// Teste
// verifica se o usuário foi criado
describe('UpdateProfile', function () {
    beforeEach(function () {
        fakeUsersRepository = new FakeUsersRepository_1.default(); // criação de repositorio fake
        fakeHashProvider = new FakeHashProvider_1.default();
        updateProfile = new UpdateProfileService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    // Testa se isso permite a atualização de perfil
    it('should be able to update the profile', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, updatedUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fakeUsersRepository.create({
                        name: 'Fulano John Doe',
                        email: 'teste@teste.com.br',
                        password: '123456',
                    })];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, updateProfile.execute({
                            user_id: user.id,
                            name: 'Fulano De Tal',
                            email: 'fulanoteste@teste.com.br',
                        })];
                case 2:
                    updatedUser = _a.sent();
                    expect(updatedUser.name).toBe('Fulano De Tal');
                    expect(updatedUser.email).toBe('fulanoteste@teste.com.br');
                    return [2 /*return*/];
            }
        });
    }); });
    // erro ao atualizar usuário que não existe
    it('should not be able to update the profile from non-existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect(updateProfile.execute({
                user_id: 'non-existing-user-id',
                name: 'Test',
                email: 'test@test.com.br',
            })).rejects.toBeInstanceOf(AppError_1.default);
            return [2 /*return*/];
        });
    }); });
});
// testa se vai permitir atualizar email já existente
it('should not be able to change to another user email', function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fakeUsersRepository.create({
                    name: 'Fulano John Doe',
                    email: 'teste@teste.com.br',
                    password: '123456',
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, fakeUsersRepository.create({
                        name: 'Test',
                        email: 'test@teste.com.br',
                        password: '123456',
                    })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, expect(updateProfile.execute({
                        user_id: user.id,
                        name: 'Fulano De Tal',
                        email: 'teste@teste.com.br',
                    })).rejects.toBeInstanceOf(AppError_1.default)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// testa se o usuário informou a senha antiga para atualizar
it('should be able to update the password', function () { return __awaiter(void 0, void 0, void 0, function () {
    var user, updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fakeUsersRepository.create({
                    name: 'Fulano John Doe',
                    email: 'teste@teste.com.br',
                    password: '123456',
                })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, updateProfile.execute({
                        user_id: user.id,
                        name: 'Fulano De Tal',
                        email: 'fulanoteste@teste.com.br',
                        old_password: '123456',
                        password: '123123',
                    })];
            case 2:
                updatedUser = _a.sent();
                expect(updatedUser.password).toBe('123123');
                return [2 /*return*/];
        }
    });
}); });
// causa erro se a senha antiga não for informada
it('should not be able to update the password with old password', function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fakeUsersRepository.create({
                    name: 'Fulano John Doe',
                    email: 'teste@teste.com.br',
                    password: '123456',
                })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, expect(updateProfile.execute({
                        user_id: user.id,
                        name: 'Fulano De Tal',
                        email: 'fulanoteste@teste.com.br',
                        password: '123123',
                    })).rejects.toBeInstanceOf(AppError_1.default)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// não pode atualizar o perfil se a senha antiga for informada errada.
it('should not be able to update the password with wrong old password', function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fakeUsersRepository.create({
                    name: 'Fulano John Doe',
                    email: 'teste@teste.com.br',
                    password: '123456',
                })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, expect(updateProfile.execute({
                        user_id: user.id,
                        name: 'Fulano De Tal',
                        email: 'fulanoteste@teste.com.br',
                        old_password: 'wrong-old-password',
                        password: '123123',
                    })).rejects.toBeInstanceOf(AppError_1.default)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
