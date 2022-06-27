const router = require('express').Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/getMe', requireAuth, userController.getMe);
router.post('/forgot-password', userController.forgotPassword);
router.post('/:id/new-password', userController.createNewPassword);

module.exports = router;
