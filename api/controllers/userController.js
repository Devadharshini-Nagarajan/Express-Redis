const userService = require("../services/userService");

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await userService.getUsers();
      console.log('u', users)
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },
  userSignup: async (req, res, next) => {
    try {
      const user = await userService.userSignup(req.body);
      res.status(201).json({
        message: "User created",
        user: user,
      });
    } catch (err) {
      next(err);
    }
  },
  userLogin: async (req, res, next) => {
    try {
      const authToken = await userService.userLogin(req.body);
      res.status(201).json({
        message: "Auth Successfull",
        token: authToken,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteUserById: async (req, res, next) => {
    const id = req.params.userId;
    try {
      const result = await userService.deleteUserById(id);
      res.status(201).json({
        message: "Deleted User Successfull",
        result: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
