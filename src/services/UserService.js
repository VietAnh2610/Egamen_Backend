const User = require("../models/UserModel");
const { genneralAccessToken, genneralRefreshToken } = require("./jwtServices");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {
      firstname,
      lastname,
      nickname,
      email,
      password,
      confirmPassword,
      phone,
      avatar,
      address,
    } = newUser;
    try {
      // Kiểm tra xem email đã tồn tại hay chưa
      const checkUser = await User.findOne({ email: email });
      if (checkUser !== null) {
        return resolve({
          status: "ERR",
          message: "Email đã được sử dụng",
        });
      }

      // Tạo người dùng mới
      const createdUser = await User.create({
        firstname,
        lastname,
        nickname,
        email,
        password,
        confirmPassword,
        phone,
        avatar,
        address,
      });

      // Nếu tạo thành công, thêm người dùng vào đầu danh sách
      if (createdUser) {
        // Giả sử bạn có một mảng người dùng hiện tại trong cơ sở dữ liệu
        let existingUsers = await User.find({}).sort({ _id: -1 }).exec(); // Lấy danh sách người dùng hiện tại và sắp xếp ngược lại (mới nhất lên đầu)

        // Thêm người dùng mới vào đầu danh sách
        existingUsers.unshift(createdUser);

        // Cập nhật cơ sở dữ liệu nếu cần thiết (ví dụ: nếu bạn lưu danh sách người dùng trong một trường cụ thể)
        // await updateUsersListInDatabase(existingUsers);

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: "Đã xảy ra lỗi khi tạo người dùng",
        error: e.message,
      });
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({ email: email });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Email không tồn tại",
        });
      }
      if (password != checkUser.password) {
        resolve({
          status: "ERR",
          message: "Mật khẩu không chính xác",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "SUCCESS ",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "the user is not defined",
        });
      }
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "SUCCESS ",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "the user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user SUCCESS ",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Truy vấn tất cả người dùng và sắp xếp theo _id giảm dần
      const allUser = await User.find().sort({ _id: -1 });
      resolve({
        status: "OK",
        message: "List all users",
        data: allUser,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Đã xảy ra lỗi khi lấy danh sách người dùng",
        error: e.message,
      });
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "the user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const refreshTokenService = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("token", token);
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshTokenService,
};
