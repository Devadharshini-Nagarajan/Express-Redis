const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userService = {
  getUsers: async () => {
    try {
      const users = await User.findAll();
      users.forEach((el) => {
        delete el.dataValues.password;
      });
      return users;
    } catch (err) {
      throw err;
    }
  },
  userSignup: async (body) => {
    try {
      const existingUser = await User.findOne({ where: { email: body.email } });
      if (existingUser) {
        throw { status: 409, message: "Mail already exists" };
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      if (!hashedPassword) {
        throw { status: 500, message: "Failed to create hash" };
      }

      const newUser = {
        username: body.username,
        password: hashedPassword,
        email: body.email,
      };
      const createdUser = await User.create(newUser);
      delete createdUser.dataValues.password;
      return createdUser;
    } catch (err) {
      throw err;
    }
  },
  userLogin: async (body) => {
    const user = await User.findOne({ where: { email: body.email } });
    if (!user) {
      throw { status: 404, message: "Auth failed" };
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      throw { status: 404, message: "Auth failed" };
    }

    // const token = jwt.sign(
    //   {
    //     email: user.email,
    //     username: user.username,
    //     id: user.id,
    //   },
    //   process.env.JWT_KEY,
    //   {
    //     expiresIn: "2h",
    //   }
    // );
    // code for redis session
    return token;
  },
  deleteUserById: async (id) => {
    try {
      const result = await User.destroy({ where: { id: id } });
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userService;
