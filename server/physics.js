const sockets = require('./sockets.js');
let useList = {};

const setUserList = (userList) => {
  userList = userList;
};

const setUser = (user) => {
  useList[user.hash] = user;
};

module.exports.setUserList = setUserList;
module.exports.setUser = setUser;