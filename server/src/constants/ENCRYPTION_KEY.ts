import dotenv from "dotenv";

dotenv.config();

const encryptionKeyHex = process.env.ENCRYPTION_KEY;
if (!encryptionKeyHex) throw new Error("ENCRYPTION_KEY environment variable is not set");
const ENCRYPTION_KEY = Buffer.from(encryptionKeyHex, 'hex');

export default ENCRYPTION_KEY;