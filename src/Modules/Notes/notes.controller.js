import { Router } from "express";
import {
  aggregateApi,
  createNote,
  deleteNote,
  deleteNotes,
  getNote,
  noteByContent,
  paginateSort,
  replaceNote,
  updateNote,
  updateUserTitles,
  userNotes,
} from "./notes.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/users.enum.js";

const router = Router();

// sorting means a lot 😇
router.patch("/titles", authentication({tokenType: tokenTypeEnum.Access}), updateUserTitles);
router.get("/note-by-content", authentication({tokenType: tokenTypeEnum.Access}), noteByContent);
router.get("/notes-with-user", authentication({tokenType: tokenTypeEnum.Access}), userNotes);
router.get("/aggregate", authentication({tokenType: tokenTypeEnum.Access}) , aggregateApi);

router.post("/", authentication({tokenType: tokenTypeEnum.Access}), createNote);
router.patch("/:id", authentication({tokenType: tokenTypeEnum.Access}), updateNote);
router.put("/:id", authentication({tokenType: tokenTypeEnum.Access}), replaceNote);
router.delete("/:id", authentication({tokenType: tokenTypeEnum.Access}), deleteNote);
router.get("/", authentication({tokenType: tokenTypeEnum.Access}), paginateSort);
router.get("/:id", authentication({tokenType: tokenTypeEnum.Access}), getNote);
router.delete("/", authentication({tokenType: tokenTypeEnum.Access}), deleteNotes);

export default router;
