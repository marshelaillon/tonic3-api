const userModel = require('./userModel');
const eventModel = require('./eventModel');
const categoryModel = require('./categoryModel');
const invitationModel = require('./invitationModel');


// An event has many categories
eventModel.hasMany(categoryModel, { as: 'category' });

// A invitation belongs to an Event.
invitationModel.belongsTo(eventModel, { as: 'event' });
// eventModel.hasMany(invitationModel, { as: 'guests' });

// A user has many invitations
userModel.belongsTo(invitationModel, { as: 'invitation' });
// invitationModel.belongsTo(userModel, { as: 'registeredUser' });

module.exports = {
  categoryModel,
  eventModel,
  userModel,
  invitationModel,
};
