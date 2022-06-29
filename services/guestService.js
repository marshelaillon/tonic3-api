const { invitationModel, eventModel } = require('../models');
const router = require('../routes/guestRoutes');
const jwt = require('jsonwebtoken');

class guestService {
  static async addGuest(body) {
    try {
      const { emails } = body;
      if (!emails) return { error: true, data: 'Please enter all fields' };

      emails.forEach(async email => {
        if (!(await invitationModel.findOne({ where: { email: email } }))) {
          const guest = await invitationModel.create({ email });
          // const event = await eventModel.findByPk(body.eventId);
          // guest.setEvent(event)
        }
      });

      return { error: false, data: 'the guests was created successfully' };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async verifyGuest(body) {
    try {
      const { email } = body;
      const guest = await invitationModel.findOne({
        where: { email: email },
      });

      if (!guest) return { error: true, data: 'Guest not found' };
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
}

module.exports = guestService;
