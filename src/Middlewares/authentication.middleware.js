import userModel from "../DB/Models/users.model.js";
import { findById } from "../DB/repo.DB.js";
import {
  RoleEnum,
  SignatureEnum,
  tokenTypeEnum,
} from "../Utils/enums/users.enum.js";
import {
  ForbiddenException,
  NotFoundException,
} from "../Utils/Responses/error.response.js";
import { getSignature, verifyToken } from "../Utils/Security/Token.js";

export const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.Access,
}) => {
  const [Bearer, token] = authorization.split(" ") || [];

  const signature = getSignature({
    signatureLevel:
      Bearer == "ADMIN"
        ? SignatureEnum.Admin
        : Bearer == "USER"
          ? SignatureEnum.User
          : new Error("Invalid signature"),
  });

  const decoded = verifyToken({
    token,
    secretKey:
      tokenType == tokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  const user = await findById({ model: userModel, id: decoded.id });
  if (!user) throw NotFoundException("User not found");

  return { user, decoded };
};

export const authentication = ({ tokenType = tokenTypeEnum.Access }) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    const { user, decoded } =
      (await decodedToken({ authorization, tokenType })) || {};

    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role))
      throw ForbiddenException("Unauthorized access");

    return next();
  };
};
