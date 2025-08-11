"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const encryptionKeyHex = process.env.ENCRYPTION_KEY;
if (!encryptionKeyHex)
    throw new Error("ENCRYPTION_KEY environment variable is not set");
const ENCRYPTION_KEY = Buffer.from(encryptionKeyHex, 'hex');
const constants = {
    ENCRYPTION_KEY,
};
exports.default = constants;
