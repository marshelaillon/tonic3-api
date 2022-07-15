const router = require('express').Router();
const { UserController, uploadFile } = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/logout', requireAuth, UserController.logoutUser);
router.get('/getMe', requireAuth, UserController.getMe);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/:id/new-password', UserController.createNewPassword);
router.post('/update/:id', requireAuth, uploadFile, UserController.userUpdate);
router.delete('/remove/:id', requireAuth, UserController.removeUser);
//router.post("/register-with-hcaptcha", UserController.hcaptcha)


// Faltan poner a Yaml
router.post('/verify-email', UserController.verifyEmail);
router.post('/verify-guest-token', UserController.verifyToken);
router.put('/update-token', UserController.updateToken);

// EVENTS
router.get('/events', requireAuth, UserController.getEvents);
router.get('/events/:id', requireAuth, UserController.getEventById);

module.exports = router;
