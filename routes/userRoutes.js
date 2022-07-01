const router = require('express').Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/logout', userController.logoutUser);
router.get('/getMe', requireAuth, userController.getMe);
router.get('/admin/user', requireAuth, userController.getUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/:id/new-password', userController.createNewPassword);
router.put('/update/:id', userController.userUpdate);
router.delete('/remove/:id', userController.removeUser);
//router.post("/register-with-hcaptcha", userController.hcaptcha)

router.post('/verify-email', userController.verifyEmail);
router.post('/verify-guest-token', userController.verifyToken);
router.put('/update-token', userController.updateToken);

module.exports = router;
