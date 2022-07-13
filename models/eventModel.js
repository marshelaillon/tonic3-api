const S = require('sequelize');
const db = require('../db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

class Event extends S.Model {
  getLocalDate() {
    const timezone = dayjs.tz.guess();
    return dayjs(this.date).local().tz(timezone).format('DD-MMMM-YYYY hh:mm A');
  }
  getLeftGeneralTimeForEvent() {
    // * Si faltan años, mostrará años, si faltan meses, mostrará meses, etc.
    try {
      const eventDate = dayjs(this.date);
      return eventDate.fromNow(true);
    } catch (error) {
      console.log(error.message);
    }
  }
  getLeftTimeForEvent() {
    try {
      const now = dayjs();
      const timezone = dayjs.tz.guess();
      const eventDate = dayjs(this.date).local().tz(timezone);
      const days = eventDate.diff(now, 'days');
      const hours = eventDate.diff(now, 'hours') - days * 24;
      const minutes =
        eventDate.diff(now, 'minutes') - days * 24 * 60 - hours * 60;
      const seconds =
        eventDate.diff(now, 'seconds') -
        days * 24 * 60 * 60 -
        hours * 60 * 60 -
        minutes * 60;
      const total = {
        days,
        hours,
        minutes,
        seconds,
      };
      return total;
    } catch (error) {
      console.log(error.message);
    }
  }
}

Event.init(
  {
    title: {
      type: S.STRING,
      allowNull: false,
    },
    url: {
      type: S.TEXT,
      allowNull: false,
    },
    description: {
      type: S.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: S.VIRTUAL,
      get() {
        return this.getDataValue('description').substring(0, 190);
      },
    },
    assistantsCount: {
      type: S.INTEGER,
      defaultValue: 0,
    },
    guestsCount: {
      type: S.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: S.STRING,
      defaultValue: 'pending',
    },
    date: {
      type: S.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: 'events' }
);

Event.addHook('beforeCreate', event => {
  /* if (!dayjs(event.date).isUTC()) {
    throw new Error('Date must be in UTC');
  } */
  /* if (dayjs(event.date).isBefore(dayjs()))
    throw new Error('The date cannot be in the past');
  else event.date = dayjs(event.date).utc().format('DD-MMMM-YYYY hh:mm A'); */
  // checkout if the date is in the past without using dayjs
  if (new Date(event.date) < new Date()) {
    throw new Error('The date cannot be in the past');
  } else {
    event.date = new Date(event.date).toISOString();
  }
  // } else {
  //   console.log(event.date);
  //   event.date = new Date(event.date).toISOString();
  // }
});

Event.prototype.increaseGuestCount = function () {
  this.guestsCount++;
  this.save();
};

module.exports = Event;
