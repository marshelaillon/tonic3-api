const router = require('express').Router();
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const requireAuth = require('../middlewares/requireAuth');

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
