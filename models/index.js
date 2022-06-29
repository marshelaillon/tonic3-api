const userModel = require('./userModel');
const eventModel = require('./eventModel');
const categoryModel = require('./categoryModel');
const invitationModel = require('./invitationModel');

// A user belongsToMany events
userModel.belongsToMany(eventModel, { through: 'user_event' });
// An event belongsToMany users
eventModel.belongsToMany(userModel, { through: 'user_event' });

// An event has many categories
eventModel.hasMany(categoryModel, { as: 'category' });

// A invitation belongs to an Event.
// invitationModel.belongsTo(eventModel, { as: 'event' });
// eventModel.hasMany(invitationModel, { as: 'guests' });

// A user has many invitations
userModel.belongsTo(invitationModel, { as: 'invitation' });

module.exports = {
  categoryModel,
  eventModel,
  userModel,
  invitationModel,
};
