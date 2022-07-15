const { invitationModel, eventModel, userModel } = require('../models');
const { use } = require('../utils/nodemailConfig');
const transporter = require('../utils/nodemailConfig');
const bcrypt = require('bcryptjs');

class adminService {
  static async addGuest(body) {
    try {
      const { emails, eventId } = body;
      if (!emails) return { error: true, data: 'Please enter guests emails' };

      const event = await eventModel.findByPk(eventId);
      if (!event) return { error: true, data: 'Event not found' };

      const randomString = Math.random().toString(36);
      const accessCode = (await bcrypt.hash(randomString, 2)).slice(0, 20);

      emails.forEach(async email => {
        const isGuest = await invitationModel.findOne({
          where: { email, eventId: event.id },
        });
        if (isGuest) {
          return;
        } else {
          const guest = await invitationModel.create({
            email,
            eventId: event.id,
            accessCode,
          });
          if (!guest) return { error: true, data: 'Something went wrong' };
          else event.increaseGuestCount();
        }
      });
      return { error: false, data: 'Guests added successfully' };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async getAllGuests() {
    try {
      const { count, rows } = await invitationModel.findAndCountAll({
        attributes: ['id', 'email', 'send', 'checked', 'createdAt', 'eventId'],
      });
      if (!count) return { error: true, data: 'Empty guests list' };
      return { error: false, data: { count, rows } };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async removeGuest(id) {
    try {
      const removed = await invitationModel.destroy({ where: { id } });
      if (!removed) return { error: true, data: 'Guest not found' };
      return { error: false, data: 'Guest deleted successfully' };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async sendInvitations() {
    try {
      const { count, rows: guests } = await invitationModel.findAndCountAll({
        where: { send: false },
      });
      if (!guests) return { error: true, data: 'Not guests found' };

      guests.map(async (guest, i) => {
        const event = await eventModel.findByPk(guest.eventId);
        await transporter.sendMail(
          {
            from: 'virtualeventst3@gmail.ar',
            to: guest.email,
            subject: 'Invitation',
            html: `<div style="text-align: center;">
            <h2>Invitation for ${event?.title}!</h2>
            <hr>
            <h4> Event will take place in ${event?.date} </h4>
            <p>We're waiting for you, click on the following link bellow</p>
            <a href="http://localhost:3000/home"> Virtual Events! </a>
            <p>Don't lose the next token, you will need it to access to the event!</p>
            <p>${guest.accessCode}</p>
            <p>See you soon!</p>
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
        await guest.setSend();
      });
      return { error: false, data: `We just sent ${count} invitations` };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async addEvent(body, file) {
    try {
      const { title, url, description, date } = body;

      if (!title || !url || !description || !date) {
        return { error: true, data: 'All fields are required' };
      }

      const event = await eventModel.create({
        ...body,
        image: file?.path ? file?.path : '',
      });
      if (!event) return { error: true, data: 'Cannot create event' };
      console.log('Fecha del evento en mi zona horaria', event.getLocalDate());
      console.log('Tiempo restante:', event.getLeftTimeForEvent());
      return { error: false, data: event };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getAllEvents(body) {
    try {
      const { count, rows } = await eventModel.findAndCountAll({
        attributes: [
          'id',
          'title',
          'assistantsCount',
          'guestsCount',
          'date',
          'status',
          'url',
          'description',
        ],
      });
      if (!count) return { error: true, data: 'Event list is empty' };
      return { error: false, data: { count, rows } };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async editEvent(body, id) {
    try {
      const editedEvent = await eventModel.update(body, {
        where: { id },
        returning: true,
      });
      if (!editedEvent) return { error: true, data: 'Something went wrong' };
      return { error: false, data: editedEvent[1][0] };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getAllUsers(body) {
    try {
      const { count, rows } = await userModel.findAndCountAll({
        attributes: [
          'id',
          'email',
          'userName',
          'isAdmin',
          'genre',
          'createdAt',
        ],
      });
      if (!count) return { error: true, data: 'Event list is empty' };
      return { error: false, data: { count, rows } };
    } catch (error) {
      return { error: true, data: error.message };
    }
  }

  static async removeEvent(paramsId) {
    try {
      const removed = await eventModel.destroy({ where: { id: paramsId } });
      if (!removed) return { error: true, data: 'Event not found' };
      return { error: false, data: 'Event deleted successfully' };
    } catch (error) {
      return { error: true, data: 'It was not possible to delete the event' };
    }
  }

  static async editUser(userId) {
    try {
      const user = await userModel.findByPk(userId);
      if (!user) return { error: true, data: 'User not found' };
      if (user.isAdmin) {
        const updated = await user.update({ isAdmin: false, returning: true });
        return {
          error: false,
          data: `Updated successfully to admin = ${updated.dataValues.isAdmin}`,
        };
      } else {
        const updated = await user.update({ isAdmin: true, returning: true });
        return {
          error: false,
          data: `Updated successfully to admin = ${updated.dataValues.isAdmin}`,
        };
      }
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = adminService;
