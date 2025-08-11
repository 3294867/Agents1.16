"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = __importDefault(require("../constants"));
const decrypt = (encryptedData) => {
    const [ivHex, encryptedHex, authTagHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", constants_1.default.ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.default = decrypt;
