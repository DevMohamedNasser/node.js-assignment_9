import { Router } from "express";
import { deleteUser, getUser, login, signup, updateUser } from "./users.service.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/", updateUser);
router.delete("/", deleteUser);
router.get("/", getUser);

export default router;
