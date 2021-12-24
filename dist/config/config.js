"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'root';
const DB_USER = process.env.DB_USER || 'uteam';
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    db_pass: DB_PASSWORD,
    db_name: DB_NAME,
    db_user: DB_USER,
};
const config = {
    server: SERVER,
};
exports.default = config;
