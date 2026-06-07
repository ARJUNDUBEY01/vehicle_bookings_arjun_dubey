const express = require('express');
const { search } = require('../controllers/search.controller');
const { searchLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.use(searchLimiter);

router.get('/', search);
router.get('/bookings', search);
router.get('/customers', search);
router.get('/vehicle', search);
router.get('/location', search);
router.get('/payment', search);

module.exports = router;
