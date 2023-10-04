const { fetchUsers } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  fetchUsers();
};
