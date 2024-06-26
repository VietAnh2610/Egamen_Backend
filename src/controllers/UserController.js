const UserService = require("../services/UserService");
const jwtServices = require("../services/jwtServices");

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmPassword, phone } =
      req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstname ||
      !lastname ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "Thiếu thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Định dạng Email không chính xác",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Mật khẩu không trùng khớp",
      });
    }
    const response = await UserService.createUser(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "Thiếu thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Định dạng Email không chính xác",
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secucre: false,
      samesite: "strict",
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    // console.log('token',token)

    // console.log('userId',userId)

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userID is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e); // Log lỗi ra console để debug
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The Token is required ",
      });
    }

    const response = await jwtServices.refreshTokenjwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "ERR",
        message: "Invalid token",
      });
    }
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "ERR",
        message: "Token expired",
      });
    }
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("refresh_token", { path: "/" });

    // Xóa cookie 'token'
    res.clearCookie("token", { path: "/" });

    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Failed to logout",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
};
