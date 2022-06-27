const User = require('../models/userModel');
const { invitationModel } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  static async registerUser(body) {
    try {
      const { isAdmin, firstName, lastName, email, password } = body;
      if (!firstName || !lastName || !email || !password) {
        return { error: true, data: 'Please enter all fields' };
      }

      // Check if user already exists
      const user = await User.findOne({ where: { email } });
      if (user) return { error: true, data: 'User already exists' };

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin,
      });

      if (newUser) {
        // RECIEN AGREGADO Alan.-
        // const updatedGues = await invitationModel.update(
        //   { checked: true },
        //   { where: email }
        // );

        return { error: false, data: 'Register successfully' };
      }
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async loginUser(body) {
    const { email, password } = body;
    try {
      const user = await User.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        return {
          error: false,
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        };
      } else {
        return { error: true, data: 'Invalid credentials' };
      }
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getMe(user) {
    const { id, firstName, lastName, email, isAdmin } = user;
    try {
      return {
        error: false,
        data: { id, firstName, lastName, email, isAdmin },
      };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = UserService;
