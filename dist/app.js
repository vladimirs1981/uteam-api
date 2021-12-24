"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const sample_1 = __importDefault(require("./routes/sample"));
const database_1 = __importDefault(require("./util/database"));
const app = (0, express_1.default)();
/*Routes*/
app.use(sample_1.default);
/**Error handling */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message,
    });
});
/**Server */
database_1.default.sync().then(() => {
    app.listen(config_1.default.server.port, () => {
        console.log(`Server running on ${config_1.default.server.hostname}:${config_1.default.server.port}`);
    });
});
