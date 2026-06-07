import jwt from "jsonwebtoken";

export const getToken = async (data) => {
  const token = await jwt.sign(data, process.env.JWT_KEY, {expiresIn: "1h"});
  return token;
};

export const decodeToken = async (token) => {
  const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
  return decodedToken;
}