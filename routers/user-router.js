const userRouter = require("express").Router();

const { getUsers } = require("../controllers/users-controller");

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get();

module.exports = userRouter;
