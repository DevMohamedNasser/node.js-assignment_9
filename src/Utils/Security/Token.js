import jwt from "jsonwebtoken";
import { RoleEnum } from "../enums/users.enum.js";
import {
  ACCESS_TOKEN_ADMIN_EXPIRES_IN,
  ACCESS_TOKEN_ADMIN_SECRET,
  ACCESS_TOKEN_USER_EXPIRES_IN,
  ACCESS_TOKEN_USER_SECRET,
  REFRESH_TOKEN_ADMIN_EXPIRES_IN,
  REFRESH_TOKEN_ADMIN_SECRET,
  REFRESH_TOKEN_USER_EXPIRES_IN,
  REFRESH_TOKEN_USER_SECRET,
} from "../../Config/config.service.js";

export const generateToken = ({ payload, secretKey, options = {} }) => {
  return jwt.sign(payload, secretKey, { ...options });
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = RoleEnum.User }) => {
  let signature = {
    refreshSignature: undefined,
    accessSignature: undefined,
  };

  switch (signatureLevel) {
    case RoleEnum.Admin:
      signature.refreshSignature = REFRESH_TOKEN_ADMIN_SECRET;
      signature.accessSignature = ACCESS_TOKEN_ADMIN_SECRET;
      break;
    default:
      signature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
      signature.accessSignature = ACCESS_TOKEN_USER_SECRET;
  }
  return signature;
};

export const getNewLoginCredentials = (user) => {
  const signature = getSignature({
    signatureLevel:
      user.role == RoleEnum.Admin ? RoleEnum.Admin : RoleEnum.User,
  });

  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: {
      expiresIn:
        user.role == RoleEnum.Admin
          ? ACCESS_TOKEN_ADMIN_EXPIRES_IN
          : ACCESS_TOKEN_USER_EXPIRES_IN,
    },
  });

  const refreshToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn:
        user.role == RoleEnum.Admin
          ? REFRESH_TOKEN_ADMIN_EXPIRES_IN
          : REFRESH_TOKEN_USER_EXPIRES_IN,
    },
  });

  return { accessToken, refreshToken };
};
