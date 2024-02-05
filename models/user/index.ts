import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tc: Boolean,
  version: {
    type: Number,
    default: 0
  }
})

export const UserModel = mongoose.model("user", UserSchema)

