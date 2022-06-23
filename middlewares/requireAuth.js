const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) throw new Error('Invalid token');
      else {
        const { id } = decodedToken;
        const user = await User.findByPk(id);
        req.user = user;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: 'You must be logged in to access this resource' });
  }
};

module.exports = requireAuth;
