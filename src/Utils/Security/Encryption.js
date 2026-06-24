import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { CRYPTO_ALGORITHM, ENC_KEY } from "../../Config/config.service.js";

export const encrypt = (text) => {
  // Generate a random initialization vector
  const iv = randomBytes(16);

  const cipher = createCipheriv(CRYPTO_ALGORITHM, ENC_KEY, iv);

  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decrypt = (encryptedData) => {
  const [ivHex, encryptedText] = encryptedData.split(":");
  const decipher = createDecipheriv(
    CRYPTO_ALGORITHM,
    ENC_KEY,
    Buffer.from(ivHex, "hex"),
  );

  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};
