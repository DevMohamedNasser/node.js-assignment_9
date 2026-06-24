import noteModel from "../../DB/Models/notes.model.js";
import userModel from "../../DB/Models/users.model.js";
import mongoose from "mongoose";
import {
  ForbiddenException,
  NotFoundException,
} from "../../Utils/Responses/error.response.js";
import {
  aggregate,
  create,
  deleteMany,
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOne,
  findOneAndReplace,
  updateMany,
} from "../../DB/repo.DB.js";
import { SuccessResponse } from "../../Utils/Responses/success.response.js";
import { verifyToken } from "../../Utils/Security/Token.js";
import { ACCESS_TOKEN_USER_SECRET } from "../../Config/config.service.js";

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  
  // const { token } = req.headers;
  // const { userId } = await verifyToken({token, secretKey : ACCESS_TOKEN_USER_SECRET});
  // const user = await userModel.findById(userId);
  // if (!user) throw NotFoundException("User not found");
  const userId = req.decoded.id;

  const note = await create({
    model: noteModel,
    data: [{ title, content, userId }],
  });

  SuccessResponse({ res, statusCode: 201, message: "Note created" });
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { userId: userIdBody, ...noteData } = req.body;
  const userId = req.decoded.id;

  const note = await findById({ model: noteModel, id });
  if (!note) throw NotFoundException("Note not found");

  if (note.userId != userId) throw ForbiddenException("U are not the owner");

  const updatedNote = await findByIdAndUpdate({
    model: noteModel,
    id,
    data: noteData,
  });
  // console.log(updateNote);

  SuccessResponse({
    res,
    statusCode: 200,
    message: "Updated",
    data: { note: updatedNote },
  });
};

export const replaceNote = async (req, res) => {
  const { id } = req.params;
  const noteData = req.body;
  const userId = req.decoded.id;

  const note = await findById({ model: noteModel, id });
  if (!note) throw NotFoundException("Note not found");

  if (note.userId != userId) throw ForbiddenException("U are not the owner");

  const updatedNote = await findOneAndReplace({
    model: noteModel,
    filter: { _id: id },
    data: noteData,
  });

  SuccessResponse({
    res,
    statusCode: 200,
    message: "Updated",
    data: { note: updatedNote },
  });
};

export const updateUserTitles = async (req, res) => {
  const { title } = req.body;
  
  // const { token } = req.headers;
  // const { userId } = await decodeToken(token);
  const userId = req.decoded.id;

  const notes = await updateMany({ model: noteModel, filter: { userId },data: { title } });

  if (!notes.modifiedCount) throw NotFoundException("No note found");

  SuccessResponse({ res, statusCode: 200, message: "All notes updated" });
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.decoded.id;

  const note = await findById({ model: noteModel, id });

  if (!note) throw NotFoundException("Note not found");

  if (note.userId != userId) throw ForbiddenException("U are not the owner");

  const deletedNote = await findByIdAndDelete({ model: noteModel, id });

  SuccessResponse({
    res,
    statusCode: 200,
    message: "Deleted",
    data: { note: deletedNote },
  });
};

export const paginateSort = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const userId = req.decoded.id;

  const notes = await find({
    model: noteModel,
    filter: { userId },
    options: { sort: { createdAt: -1 }, skip, limit },
  });

  SuccessResponse({ res, message: "done", data: notes });
};

export const getNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.decoded.id;

  const note = await findById({ model: noteModel, id });

  if (!note) throw NotFoundException("Note not found");

  if (note.userId != userId) throw ForbiddenException("U are not the owner");

  SuccessResponse({ res, statusCode: 200, message: "done", data: note });
};

// GET /notes/note-by-content => / notes/note-by-content?content=Workout Plan
export const noteByContent = async (req, res) => {
  const { content } = req.query;
  const userId = req.decoded.id;

  const note = await findOne({ model: noteModel, filter: { content } });

  if (!note) throw NotFoundException("Note not found");

  if (note.userId != userId) throw ForbiddenException("U are not the owner");

  SuccessResponse({ res, statusCode: 200, message: "done", data: note });
};

export const userNotes = async (req, res) => {
  const userId = req.decoded.id;

  const notes = await find({
    model: noteModel,
    filter: { userId },
    select: "title",
    options: {
      populate: {
        path: "userId",
        select: "email -_id",
      },
    },
  });

  SuccessResponse({ res, statusCode: 200, message: "done", data: notes });
};

export const aggregateApi = async (req, res) => {
  const { title } = req.query;
  const userId = req.decoded.id;

  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ];

  if (title) pipeline.push({ $match: { title } });

  const result = await aggregate({ model: noteModel, pipeline });

  SuccessResponse({ res, statusCode: 200, message: "done", data: result });
};

export const deleteNotes = async (req, res) => {
  const userId  = req.decoded.id;

  const command = await deleteMany({ model: noteModel, filter: { userId } });

  if (!command.deletedCount) throw NotFoundException("Notes not found");

  SuccessResponse({ res, statusCode: 200, message: "Deleted" });
};
