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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const sample_1 = __importDefault(require("./routes/sample"));
const database_1 = require("./util/database");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
}));
/*Routes*/
app.use(sample_1.default);
/**Error handling */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message,
    });
});
/**Server + DB */
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.database.sequelize.sync({ alter: true }).then(() => {
        app.listen(config_1.default.server.port, () => {
            console.log(`Server is running on port:${config_1.default.server.port}`);
        });
    });
}))();
