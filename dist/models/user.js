"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitUser = void 0;
const Sequelize = __importStar(require("sequelize"));
class User extends Sequelize.Model {
}
const InitUser = (sequelize) => {
    User.init({
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
        password: {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
        },
    }, {
        tableName: 'users',
        sequelize,
    });
};
exports.InitUser = InitUser;
