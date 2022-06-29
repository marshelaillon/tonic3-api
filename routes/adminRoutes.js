const router = require('express').Router();
const adminController = require('../controllers/adminController');

// rutas para el admin.
// router.post('/send-guest-invitation');
router.post('/add-guest', adminController.addGuest);
router.delete('/remove-guest', adminController.removeGuest);
router.get('/get-all-guests', adminController.getAllGuests);
router.post('/add-event', adminController.addEvent);

module.exports = router;
