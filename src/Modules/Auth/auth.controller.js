import { Router } from "express";
import { googleLogin, login, refreshToken, signup } from "./auth.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/users.enum.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const router = Router();

router.post("/signup", validation(signupSchema), signup);
router.post("/login", validation(loginSchema), login);
router.post(
  "/refresh-token",
  authentication({ tokenType: tokenTypeEnum.Refresh }),
  refreshToken,
);
router.post("/social-login", googleLogin);

export default router;
