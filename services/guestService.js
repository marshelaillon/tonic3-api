const { invitationModel } = require('../models');
const router = require('../routes/guestRoutes');

class guestService {
  static async addGuest(body) {
    try {
      const { email, accessCode } = body;
      if (!email) return { error: true, data: 'Please enter all fields' };

      const guest = await invitationModel.findOne({ where: { email } });
      if (guest) return { error: true, data: 'guest already exists' };

      const addedGuest = invitationModel.create(body);
      if (addedGuest)
        return { error: false, data: 'the guest was created successfully' };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async getList() {
    try {
      const guestEmailList = await invitationModel.findAll({
        attributes: ['email'],
      });

      if (!guestEmailList)
        return { error: true, data: "Guest's list is empty" };

      return { error: false, data: guestEmailList };
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
      } // 1234 1234
      if (token !== verifiedGuest.accessCode)
        return { error: false, data: false };

      return { error: false, data: true };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }
}

module.exports = guestService;
