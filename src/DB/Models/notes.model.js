import mongoose from "mongoose";
import { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      validate: {
        validator: function (v) {
          return v !== v.toUpperCase();
        },
        message: (props) =>
          `${props.value} must not to be entirely uppercase!!!`,
      },
    },
    content: {
      type: String,
      required: [true, "content is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, `userId is required!!!`],
    },
  },
  { timestamps: true },
);

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
