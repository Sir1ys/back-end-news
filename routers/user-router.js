const { getUsers } = require("../controllers/users-controller");
const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

module.exports = userRouter;
