const router = require('express').Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/getMe', requireAuth, userController.getMe);
router.post('/forgot-password', userController.forgotPassword);
router.post('/:id/new-password', userController.createNewPassword);
router.get('/admin/user', requireAuth, userController.getUsers);
router.put('/update/:id', userController.userUpdate);
router.delete('/remove/:id', userController.removeUser);
//router.post("/register-with-recaptcha",userController.recaptcha)



module.exports = router;
