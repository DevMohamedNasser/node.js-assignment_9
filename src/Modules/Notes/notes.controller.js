import { Router } from "express";
import {
  aggregate,
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

const router = Router();

// sorting means a lot 😇
router.patch("/titles", updateUserTitles);
router.get("/note-by-content", noteByContent);
router.get("/notes-with-user", userNotes);
router.get("/aggregate", aggregate);

router.post("/", createNote);
router.patch("/:id", updateNote);
router.put("/:id", replaceNote);
router.delete("/:id", deleteNote);
router.get("/", paginateSort);
router.get("/:id", getNote);
router.delete("/", deleteNotes);

export default router;
