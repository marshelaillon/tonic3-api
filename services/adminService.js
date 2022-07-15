const { invitationModel, eventModel, userModel } = require('../models');
const { use } = require('../utils/nodemailConfig');
const transporter = require('../utils/nodemailConfig');

class adminService {
  static async addGuest(body) {
    try {
      const { emails, eventId } = body;
      if (!emails) return { error: true, data: 'Please enter guests emails' };

      emails.forEach(async email => {
        const [invitation, create] = await invitationModel.findOrCreate({
          where: { email: email, eventId: eventId },
        });
        if (create) {
          const event = await eventModel.findByPk(eventId);
          if (!event) return { error: true, data: 'Event not found' };
          await invitation.setEvent(event);
          await event.increaseGuestCount();
        } else {
          return { error: true, data: 'Llego el no deseado' };
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
            <a href="http://localhost:3000/home"> asfdsdfhfdgdjghfkhjkghjlg </a>
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

  static async addEvent(body) {
    try {
      const { title, url, description, date } = body;

      if (!title || !url || !description || !date)
        return { error: true, data: 'All fields are required' };
      const event = await eventModel.create(body);
      if (!event) return { error: true, data: 'Cannot create event' };
      //cambien la data de event{maxi}
      // ! MOSTRAR A LES MUCHACHES xd
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
      // console.log('edited event', [...editedEvent[1].dataValues]);
      if (!editedEvent) return { error: true, data: 'Event not found' };
      return { error: false, data: editedEvent[1][0] };
    } catch (error) { }
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

  static async editUser(paramsId) {
    try {
      const user = await userModel.findByPk(paramsId);
      console.log('LLEGUE ACA ', user.isAdmin);

      if (user.isAdmin) {
        console.log('llegue');
        user.update({ isAdmin: false });
      } else {
        user.update({ isAdmin: true });
      }
      console.log('LLEGUE ACA ', user.isAdmin);

      return { error: false, data: 'Update successfully' };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = adminService;
