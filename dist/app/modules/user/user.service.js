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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const prisma_1 = require("../../utils/prisma");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists!');
    }
    const password = payload.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    const { password: _ } = result, userWithoutPassword = __rest(result, ["password"]);
    return userWithoutPassword;
});
const updateUserInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.update({
        where: { id: user === null || user === void 0 ? void 0 : user.id },
        data: payload,
    });
    const { password: _ } = result, userWithoutPassword = __rest(result, ["password"]);
    return userWithoutPassword;
});
const getMeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist!');
    }
    const { password: _ } = result, userWithoutPassword = __rest(result, ["password"]);
    return userWithoutPassword;
});
const deleteUserFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.delete({ where: { id } });
    const { password: _ } = result, userWithoutPassword = __rest(result, ["password"]);
    return userWithoutPassword;
});
exports.UserServices = {
    createUserIntoDB,
    updateUserInDB,
    getMeFromDB,
    deleteUserFromDB,
};
