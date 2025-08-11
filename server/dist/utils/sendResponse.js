"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, message, data = null) => {
    res.status(status).json({
        message,
        data
    });
};
exports.sendResponse = sendResponse;
