import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const salt = process.env.SALT;
const key = scryptSync(process.env.CRYPTO_KEY, salt, 32);
const algorithm = process.env.CRYPTO_ALGORITHM;

export const encrypt = (text) => {
  // Generate a random initialization vector
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return both the encrypted data and the IV
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};

export const decrypt = (encryptedData, iv) => {
  // Create decipher
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
