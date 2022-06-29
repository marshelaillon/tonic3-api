const { invitationModel, eventModel } = require('../models');
const jwt = require('jsonwebtoken');

class adminService {
  static async addGuest(body) {
    try {
      const { emails, eventId } = body;
      if (!emails) return { error: true, data: 'Please enter all fields' };

      emails.forEach(async email => {
        const [invitation, created] = await invitationModel.findOrCreate({
          where: { email: email },
        });
        if (created) {
          const event = await eventModel.findByPk(eventId);
          if (!event) return { error: true, data: 'Event not found' };
          await invitation.setEvent(event);
          event.increaseGuestCount();
        }
      });

      return { error: false, data: 'the guests was created successfully' };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async getAllGuests() {
    try {
      const { count, rows } = await invitationModel.findAndCountAll();
      if (!count) return { error: true, data: 'Empty guests list' };
      return { error: false, data: { count, rows } };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async removeGuest(body) {
    try {
      const { id } = body;
      const removedGuest = await invitationModel.destroy({ where: { id } });
      if (!removedGuest) return { error: true, data: 'Guest not found' };
      return { error: false, data: 'Delete complete' };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async addEvent(body) {
    try {
      const { title, url, description } = body;
      if (!title || !url || !description)
        return { error: true, data: 'All fields are required' };
      const event = await eventModel.create(body);
      if (!event) return { error: true, data: 'cannot create event' };
      return { error: false, data: 'created successfully' };

      // if (!isCreated && event)
      //   return { error: false, data: 'already exists in db' };
      // if (isCreated) return { error: false, data: 'created successfully' };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async editEvent(body, id) {
    try {
      const editedEvent = await eventModel.update(body, {
        where: { id },
        returning: true,
      });
      // console.log('edited event', [...editedEvent[1].dataValues]);
      if (!editedEvent) return { error: true, data: 'Event not found' };
      return { error: false, data: editedEvent[1][0] };
    } catch (error) {}
  }
}

module.exports = adminService;
