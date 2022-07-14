const router = require('express').Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

// LOGIN/LOGOUT/REGISTER
router.get('/logout', requireAuth, userController.logoutUser);
router.get('/getMe', requireAuth, userController.getMe);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/:id/new-password', userController.createNewPassword);
router.put('/update', requireAuth, userController.userUpdate);
router.delete('/remove', requireAuth, userController.removeUser);
//router.post("/register-with-hcaptcha", userController.hcaptcha)

// ACCESS TOKEN & EMAIL VERIFICATION
router.post('/verify-email', userController.verifyEmail);
router.post('/verify-guest-token', userController.verifyToken);
router.put('/update-token', userController.updateToken);

// EVENTS
router.get('/events', requireAuth, userController.getEvents);
router.get('/events/:id', requireAuth, userController.getEventById);

module.exports = router;
