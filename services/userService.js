const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
  static async registerUser(body) {
    try {
      const {
        isAdmin,
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        genre,
      } = body;
      if (!firstName || !lastName || !email || !password || !genre) {
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
        profilePicture,
        genre,
      });

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
    const { id, firstName, lastName, email, isAdmin, profilePicture, genre } =
      user;
    try {
      return {
        error: false,
        data: {
          id,
          firstName,
          lastName,
          email,
          isAdmin,
          profilePicture,
          genre,
        },
      };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  //hacer un apartado de contraseña solo ya q si la cambian desde aca no se hashea y tener mejores validaciones {M&M}
  static async userUpdate(body, params) {
    const { isAdmin, firstName, lastName, password, profilePicture, genre } = body;
    try {
      // verifico si el usuario existe
      const user = await User.findByPk(params);
      //si es usuario no existe
      if (!user) return { error: true, data: 'User does not exist' };
      // si el usuario existe le hasheamos el password si lo tiene
      const hashedPassword = await bcrypt.hash(password, 12);
      // si el ususario existe y con el password hasheado se le aplican los cambios
      await user.update({
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
}

module.exports = UserService;
