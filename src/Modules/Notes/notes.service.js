import { decodeToken } from "../../Utils/Token.js";
import noteModel from "../../DB/Models/notes.model.js";
import userModel from "../../DB/Models/users.model.js";
import mongoose from "mongoose";

export const createNote = async (req, res) => {
  try {
    const { token } = req.headers;
    const { title, content } = req.body;
    const { userId } = await decodeToken(token);

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!!!" });

    const note = await noteModel.create({ title, content, userId });

    return res.status(201).json({ message: "Note created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;
    const { userId: userIdBody, ...noteData } = req.body;
    const { userId } = await decodeToken(token);

    const note = await noteModel.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found!!!" });

    if (note.userId != userId)
      return res.status(403).json({ message: "U are not the owner!!!" });

    const updatedNote = await noteModel.findByIdAndUpdate(
      id,
      { $set: noteData, $inc: { __v: 1 } },
      { new: true, runValidators: true },
    );

    console.log(updateNote);

    return res.status(200).json({ message: "updated", note: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const replaceNote = async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;
    const noteData = req.body;
    const { userId } = await decodeToken(token);

    const note = await noteModel.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found!!!" });

    if (note.userId != userId)
      return res.status(403).json({ message: "U are not the owner!!!" });

    const updatedNote = await noteModel.findOneAndReplace(
      { _id: id },
      { ...noteData },
      { new: true, runValidators: true },
    );

    console.log(updateNote);

    return res.status(200).json({ message: "updated", note: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateUserTitles = async (req, res) => {
  try {
    const { token } = req.headers;
    const { title } = req.body;
    const { userId } = await decodeToken(token);

    const notes = await noteModel.updateMany({ userId }, { $set: { title } });

    if (!notes.modifiedCount)
      return res.status(404).json({ message: "No note found" });

    return res.status(200).json({ message: "All notes updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;
    const { userId } = await decodeToken(token);

    const note = await noteModel.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.userId != userId)
      return res.status(403).json({ message: "U are not the owner" });

    const deletedNote = await noteModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "deleted", note: deletedNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const paginateSort = async (req, res) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 5;
    const skip = (page - 1) * limit;

    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const notes = await noteModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ message: "done", notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const note = await noteModel.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId != userId)
      return res.status(403).json({ message: "U are not the owner" });

    return res.status(200).json({ message: "done", note });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// GET /notes/note-by-content => / notes/note-by-content?content=Workout Plan
export const noteByContent = async (req, res) => {
  try {
    const { content } = req.query;
    console.log(content);
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const note = await noteModel.findOne({ content });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId != userId)
      return res.status(403).json({ message: "U are not the owner" });

    return res.status(200).json({ message: "done", note });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const userNotes = async (req, res) => {
  try {
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const notes = await noteModel
      .find({ userId })
      .select("title")
      .populate("userId", "email -_id");

    return res.status(200).json({ message: "done", notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const aggregate = async (req, res) => {
  try {
    const { token } = req.headers;
    const { title } = req.query;
    const { userId } = await decodeToken(token);

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

    const aggregate = await noteModel.aggregate(pipeline);

    return res.status(200).json({ message: "done", data: aggregate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteNotes = async (req, res) => {
  try {
    const { token } = req.headers;
    const { userId } = await decodeToken(token);

    const command = await noteModel.deleteMany({ userId });

    if (!command.deletedCount)
      return res.status(404).json({ message: "Notes not found" });

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
