const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailConfig');

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

      await transporter.sendMail(
        {
          from: 'virtualevents@gmail.ar',
          to: email,
          subject: 'Register',
          html: `<div>
          <h2>REGISTER SUCCESSFULLY!</h2>
        </div>`,
        },
        (error, info) => {
          if (error) {
            return { error: true, data: 'Something went wrong!' };
          } else {
            return {
              error: false,
              data: 'Email sent successfully!',
            };
          }
        }
      );
      if (newUser) return { error: false, data: 'Register successfully' };
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

  static async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    let message = 'Check your email for a link to reset your password!';

    if (!user)
      return {
        error: true,
        data: message,
      };

    try {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });
      const verificationLink = `http://localhost:3000/new-password/${user.id}/${token}`;
      await transporter.sendMail({
        from: 'virtualevents@gmail.ar',
        // ? DESCOMENTAR LUEGO: to: user.email,
        to: `marshel.aillon@gmail.com, maxirecibos182@gmail.com, benitez.alanez@gmail.com`,
        subject: 'NEW PASSWORD!',
        html: `<div>
              <h2>Click on the following link to reset your password: </h2>
              <h2><a href=${verificationLink}>Go to verification link!</a></h2>
            </div>`,
      });
      return {
        error: false,
        data: 'Email sent successfully!',
      };
    } catch (error) {
      return {
        error: true,
        data: message,
      };
    }
  }

  static async createNewPassword(newPassword, id) {
    try {
      const user = await User.findByPk(id);
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await user.update({ password: hashedPassword });
      return { error: false, data: 'Password changed successfully!' };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = UserService;
