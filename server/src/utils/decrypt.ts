import crypto from "crypto";
import constants from '../constants';

const decrypt = (encryptedData: string): string => {
  const [ivHex, encryptedHex, authTagHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", constants.ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final('utf8');
  return decrypted;
};

export default decrypt;