const { invitationModel, eventModel, userModel } = require('../models');
const transporter = require('../utils/nodemailConfig');

class adminService {
  static async addGuest(body) {
    try {
      const { emails, eventId } = body;
      if (!emails) return { error: true, data: 'Please enter all fields' };

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

      return { error: false, data: 'the guests was created successfully' };
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

  static async removeGuest(body) {
    try {
      const removedGuest = await invitationModel.destroy({
        where: { id: body },
      });
      if (!removedGuest) return { error: true, data: 'Guest not found' };
      return { error: false, data: 'Delete complete' };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async sendInvitations() {
    console.log("aca estamos ");
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
          'createdAt',
          'status'
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
    } catch (error) {}
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

  //ELIMINAR EVENTO {maxi}
  static async removeEvent(paramsId) {
    console.log(paramsId, "LLEGUE ACA")
    try {
      const removedEvent = await eventModel.destroy({ where: { id: paramsId } });
      if (!removedEvent) return { error: true, data: 'Guest not found' };
      return { error: false, data: 'Delete complete' };
    } catch (error) {
      return { error: true, data: "Delete Incomplete ", error }
    }
  }

}

module.exports = adminService;
