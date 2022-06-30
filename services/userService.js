const User = require('../models/userModel');
const { invitationModel, eventModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailConfig');
const { request } = require('express');

class UserService {
  static async registerUser(body) {
    console.log(body);
    try {
      const {
        userName,
        isAdmin,
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        genre,
      } = body;
      if (!userName || !email || !password) {
        return { error: true, data: 'Please enter all fields' };
      }
      // Check if user already exists
      const user = await User.findOne({ where: { email } });
      if (user) return { error: true, data: 'User already exists' };
      // verificamos que si o si tenga invitacion.
      const invitation = await invitationModel.findOne({ where: { email } });
      if (!invitation)
        return { error: true, data: "could'nt found your invitation" };
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await User.create({
        userName,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      if (newUser) {
        newUser.setInvitation(invitation);
        const updatedGuest = await invitationModel.update(
          { checked: true },
          { where: { email } }
        );
        await transporter.sendMail(
          {
            from: 'virtualeventst3@gmail.ar',
            to: email,
            subject: 'Register',
            html: `<div><h2>REGISTER SUCCESSFULLY!</h2>
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
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
            genre: user.genre,
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
    const {
      id,
      userName,
      firstName,
      lastName,
      email,
      isAdmin,
      profilePicture,
      genre,
    } = user;
    try {
      return {
        error: false,
        data: {
          id,
          userName,
          firstName,
          lastName,
          email,
          isAdmin,
          profilePicture,
          genre,
        },
      };
    } catch (error) {
      return { error: true, data: 'Not authorized!' };
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
        to: user.email,
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
  //hacer un apartado de contraseña solo ya q si la cambian desde aca no se hashea y tener mejores validaciones {M&M}
  static async userUpdate(body, params) {
    const {
      isAdmin,
      userName,
      firstName,
      lastName,
      password,
      profilePicture,
      genre,
    } = body;
    try {
      // verifico si el usuario existe
      const user = await User.findByPk(params);
      //si es usuario no existe
      if (!user) return { error: true, data: 'User does not exist' };
      // si el usuario existe le hasheamos el password si lo tiene
      const hashedPassword = await bcrypt.hash(password, 12);
      // si el ususario existe y con el password hasheado se le aplican los cambios
      await user.update({
        userName,
        firstName,
        lastName,
        password: hashedPassword,
        profilePicture,
        genre,
      });
      // devolvemos errore si los hubo y una data
      return { error: false, data: 'Update successfully' };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async removeUser(params) {
    try {
      //buscamos el usuario a eliminar
      const user = await User.findByPk(params);
      if (!user) {
        //verificamos si el usuario a liminar existe en caso de q no devolvemos un error
        return { error: true, data: 'user not found' };
      } else {
        //si el usuario existe lo elimminamos
        await user.destroy();
        return { error: false, data: 'User Deleted' };
      }
    } catch (error) {
      return { error: true, data: 'server problems' };
    }
  }

  static async getUsers(user) {
    try {
      if (user.isAdmin === true) {
        // treamos informacion necesaria de todos los usuarios
        const users = await User.findAll({
          attributes: [
            'userName',
            'firstName',
            'lastName',
            'email',
            'id',
            'profilePicture',
            'genre',
          ],
        });
        return { error: false, data: users };
      }
    } catch (error) {
      return { error: true, data: 'Not authorized' };
    }
  }

  /* static async recaptcha (body) {
    if (!body.tokenCaptcha) {
        return { error: true, data: "reCaptcha token is missing" };
    }
console.log(body.tokenCaptcha);

    try {
      console.log("entramos al try");
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${body.tokenCaptcha}`;
        const response = await request(googleVerifyUrl);
        console.log(response, "yo soy el response");
        const { success } = response.data;
        if (success) {
            //hace el register y guarda el user en la base de datos
            return { error: false, data: true };
        } else {
            return { error: true, data: "Invalid Captcha. Try again." };
        }
    } catch (e) {
      console.log("no entramos nunca al try");
        return { error: true, data: (e, "reCaptcha error.") };
    }
}; */

  static async verifyEmail(body) {
    try {
      const { email } = body;
      const guest = await invitationModel.findOne({
        where: { email },
      });

      if (!guest) return { error: true, data: { verified: false } };
      return { error: false, data: { verified: true, checked: guest.checked } };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async verifyToken(body) {
    const { email, token } = body;
    console.log('email', email, 'token', token);
    try {
      const verifiedGuest = await invitationModel.findOne({
        where: { email: email },
      });
      if (!verifiedGuest) {
        return { error: true, data: 'No se encontro el invitado' };
      }
      if (token !== verifiedGuest.accessCode)
        return { error: false, data: false };

      return { error: false, data: true };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async updateToken(body) {
    try {
      const { email } = body;
      const guest = await invitationModel.findOne({ where: { email } });
      const token = await guest.updateToken();

      if (!token) return { error: true, data: 'Cannot generate a new token' };

      await transporter.sendMail(
        {
          from: 'virtualevents@gmail.ar',
          to: email,
          subject: 'NEW TOKEN',
          html: `<div>
              <h2>This is your new access code: ${token}</h2>
            </div>`,
        },
        (error, info) => {
          if (error) {
            return { error: true, data: 'Something went wrong!' };
          }
        }
      );
      return { error: false, data: 'Token updated successfully' };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }
}

module.exports = UserService;
