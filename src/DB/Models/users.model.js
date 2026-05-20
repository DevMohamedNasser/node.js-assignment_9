import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  phone: {
    type: String,
    required: [true, "phone is required"],
  },
  age: {
    type: Number,
    min: [18, "age must be at least 18"],
    max: [60, "age must be at most 60"],
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
