const router = require('express').Router();
const userRoutes = require('./userRoutes');
const guestRoutes = require('./guestRoutes');

router.use('/users', userRoutes);
router.use('/guests', guestRoutes);

module.exports = router;
