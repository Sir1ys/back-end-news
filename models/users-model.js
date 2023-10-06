const db = require("../db/connection");

exports.fetchUsers = () => {
  const query = "SELECT * FROM users;";

  return db.query(query).then(({ rows }) => {
    return { users: rows };
  });
};

exports.fetchUser = (username) => {
  const query = `SELECT * FROM users 
  WHERE username = '${username}';`;

  return this.fetchUsers()
    .then(({ users }) => {
      const namesGreenList = users.map((user) => user.username);

      return namesGreenList;
    })
    .then((namesGreenList) => {
      if (!namesGreenList.includes(username)) {
        return Promise.reject({
          msg: `User with ${username} username doesn't exist`,
          status: 404,
        });
      }

      return db.query(query);
    })
    .then(({ rows }) => {
      return { user: rows[0] };
    });
};
