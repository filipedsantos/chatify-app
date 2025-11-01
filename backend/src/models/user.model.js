import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String , required: true, min: 4 },
  profilePic: { type: String , default: "" },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;