import { Router } from "express";
import { deleteUser, getUser, updateUser } from "./users.service.js";
import {
  authentication,
  authorization,
} from "../../Middlewares/authentication.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/users.enum.js";

const router = Router();

router.patch(
  "/",
  authentication({ tokenType: tokenTypeEnum.Access }),
  updateUser,
);
router.delete(
  "/",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.User] }),
  deleteUser,
);
router.get("/", authentication({ tokenType: tokenTypeEnum.Access }), getUser);

export default router;
