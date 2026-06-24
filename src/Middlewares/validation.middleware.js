import { BadRequestException } from "../Utils/Responses/error.response.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const validationRes = schema.validate(req.body, { abortEarly: false });
    if (validationRes.error) throw BadRequestException(validationRes.error);
    next();
  };
};
