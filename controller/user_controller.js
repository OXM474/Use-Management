import UserModel from "../model/models.js";

//register
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return next(
        res
          .status(409)
          .json({ success: false, message: "Email already exists" })
      );
    }
    const newuser = await UserModel.create({ username, email, password });
    res.status(200).json({
      success: true,
      newuser,
    });
  } catch (err) {
    return next(res.status(500).send(err.message));
  }
};

// login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(
        res.status(409).json({
          success: false,
          message: "Please enter your email and password",
        })
      );
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(
        res.status(401).json({ success: false, message: "Invalid Email" })
      );
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(
        res.status(401).json({ success: false, message: "Invalid Password" })
      );
    }

    const token = await user.signAccessToken();

    res.status(200).json({
      success: true,
      message: "login Successfully.",
      user,
      token,
    });
  } catch (err) {
    return next(res.status(500).send(err.message));
  }
};

// get one user
export const getUserInfo = async (req, res, next) => {
  try {
    const id = req.user?._id;
    const user = await UserModel.findById(id);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(res.status(500).send(err.message));
  }
};

// get all users by admin
export const getAllUser = async (req, res, next) => {
  try {
    const users = await UserModel.find().sort({ createAt: -1 });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (err) {
    return next(res.status(500).send(err.message));
  }
};

// Update user info
export const updateUserInfo = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { username, email } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );
    if (!user) {
      return next(
        res.status(404).json({
          success: false,
          error: "User not found!",
        })
      );
    }
    await user.save();
    res.status(201).json({
      success: true,
      data: await UserModel.findById(id),
    });
  } catch (error) {
    return next(res.status(500).send(error.message));
  }
};

// Update user password
export const updateUserPassword = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(
        res.status(400).json({
          success: false,
          error: "Please enter old and new password!",
        })
      );
    }
    const user = await UserModel.findById(id);
    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return next(
        res.status(400).json({
          success: false,
          error: "Invalid old password!",
        })
      );
    }
    user.password = newPassword;
    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(res.status(500).send(error.message));
  }
};

// Update user role for admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return next(
        res.status(404).json({
          success: false,
          error: "User not found!",
        })
      );
    }
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(res.status(500).send(error.message));
  }
};

// Delete user for admin
export const deleteOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return next(
        res.status(404).json({
          success: false,
          error: "User not found!",
        })
      );
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(res.status(500).send(error.message));
  }
};
