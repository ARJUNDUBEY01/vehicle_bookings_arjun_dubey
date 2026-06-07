const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
// Refresh token route can be implemented similar to login if using refresh tokens
router.post('/refresh-token', authLimiter, (req, res) => res.status(501).json({ success: false, message: 'Not implemented yet' }));

module.exports = router;
