"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// globalForPrisma is used to store the PrismaClient instance in the global scope
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
