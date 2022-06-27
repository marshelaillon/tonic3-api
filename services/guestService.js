const { invitationModel } = require('../models');

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
}

module.exports = guestService;
