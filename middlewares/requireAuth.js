const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) return res.status(401).json({ error: 'Unauthorized' });
      else {
        const { id } = decodedToken;
        const user = await User.findByPk(id);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
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
