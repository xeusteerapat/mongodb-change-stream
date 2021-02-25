const User = require('../models/User');

const createUser = async (req, res) => {
  const user = await User.create(req.body);

  res.send(user);
};

module.exports = { createUser };
