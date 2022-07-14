const router = require('express').Router();
const adminController = require('../controllers/adminController');
const requireAuth = require('../middlewares/requireAuth');

// rutas para el admin. PROTEGERLAS  !!!!!
router.get('/send-invitations', requireAuth, adminController.sendInvitations);
router.post('/add-guest', requireAuth, adminController.addGuest);
router.delete('/remove-guests/:id', requireAuth, adminController.removeGuest);
router.delete('/remove-events/:id', requireAuth, adminController.removeEvent);
router.get('/get-all-guests', requireAuth, adminController.getAllGuests);
router.get('/get-all-users', requireAuth, adminController.getAllUsers);
router.get('/get-all-events', requireAuth, adminController.getAllEvents);
router.put('/edit-event/:id', requireAuth, adminController.editEvent);
router.put('/edit-user/:id', requireAuth, adminController.editUser);
router.post('/add-event', requireAuth, adminController.addEvent);

module.exports = router;
