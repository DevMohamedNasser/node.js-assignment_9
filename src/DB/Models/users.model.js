import mongoose, { Schema } from "mongoose";
import { ProviderEnum, RoleEnum } from "../../Utils/enums/users.enum.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      // required: [true, "password is required"],
      required: function (values) {
        return this.provider == ProviderEnum.System;
      },
    },
    phone: {
      type: String,
      // required: [true, "phone is required"],
      required: function (values) {
        return this.provider == ProviderEnum.System;
      },
    },
    age: {
      type: Number,
      min: [18, "age must be at least 18"],
      max: [60, "age must be at most 60"],
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    picture: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
