const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { uploadFile } = require('../middlewares/multer');

// rutas para el admin. PROTEGERLAS  !!!!!
router.get('/send-invitations', adminController.sendInvitations);
router.post('/add-guest', adminController.addGuest);
router.delete('/remove-guests/:id', adminController.removeGuest);
router.delete('/remove-events/:id', adminController.removeEvent);
router.get('/get-all-guests', adminController.getAllGuests);
router.get('/get-all-users', adminController.getAllUsers);
router.get('/get-all-events', adminController.getAllEvents);
router.put('/edit-event/:id', adminController.editEvent);
router.put('/edit-user/:id', adminController.editUser);
router.post('/add-event', uploadFile.single('image'), adminController.addEvent);

module.exports = router;
