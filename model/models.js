import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Please enter your name!"] },
    email: {
      type: String,
      unique: true,
      require: [true, "Please enter your Email!"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password!"],
    },
    role: {
      type: Number,
      default: 0, // 0 for User ,1 for Admin
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 18);
  next();
});

userSchema.methods.comparePassword = async function (compass) {
  return await bcrypt.compare(compass, this.password);
};

userSchema.methods.signAccessToken = async function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
