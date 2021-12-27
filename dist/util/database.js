"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const user_1 = require("../models/user");
const config_1 = __importDefault(require("../config/config"));
exports.sequelize = new sequelize_1.Sequelize(config_1.default.server.db_name, config_1.default.server.db_user, config_1.default.server.db_pass, {
    dialect: 'mysql',
    host: 'localhost',
});
exports.database = {
    sequelize: exports.sequelize,
    User: (0, user_1.InitUser)(exports.sequelize),
};
