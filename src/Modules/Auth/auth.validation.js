import joi from "joi";

export const signupSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6),
  phone: joi.string().length(11),
  age: joi.number().min(0).max(150),
  confirmPassword: joi
    .string()
    .valid(joi.ref("password")),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6)
})