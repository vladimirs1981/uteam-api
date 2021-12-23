"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sampleRoute = (req, res, next) => {
    const message = 'Sample route called.';
    return res.status(200).json({
        message: message,
    });
};
exports.default = {
    sampleRoute,
};
