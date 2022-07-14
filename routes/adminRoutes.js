const router = require('express').Router();
const adminController = require('../controllers/adminController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/add-event', requireAuth, adminController.addEvent);
router.post('/add-guest', requireAuth, adminController.addGuest);
router.get('/send-invitations', requireAuth, adminController.sendInvitations);
router.get('/get-all-guests', requireAuth, adminController.getAllGuests);
router.get('/get-all-users', requireAuth, adminController.getAllUsers);
router.get('/get-all-events', requireAuth, adminController.getAllEvents);
router.delete('/remove-guests/:id', requireAuth, adminController.removeGuest);
router.delete('/remove-events/:id', requireAuth, adminController.removeEvent);
router.put('/edit-event/:id', requireAuth, adminController.editEvent);
router.put('/edit-user/:id', requireAuth, adminController.editUser);

module.exports = router;
