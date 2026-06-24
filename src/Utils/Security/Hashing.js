import bcrypt from "bcrypt";

export const hashing = async (plainText) => {
  const cipher = await bcrypt.hash(plainText, Number(process.env.SALT));
  return cipher;
};

export const compareHash = async (password, cipher) => {
  const isAuthenticated = await bcrypt.compare(password, cipher);
  return isAuthenticated;
}