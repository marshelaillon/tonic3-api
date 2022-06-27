const router = require('express').Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/getMe', requireAuth, userController.getMe);
router.get('/admin/user', requireAuth, userController.getUsers);
router.put('/update/:id', userController.userUpdate);
router.delete('/remove/:id', userController.removeUser);

module.exports = router;
