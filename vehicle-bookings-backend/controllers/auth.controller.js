const authService = require('../services/auth.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  success(res, result, 'User registered successfully', 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error('Please provide an email and password');
    error.statusCode = 400;
    throw error;
  }
  const result = await authService.loginUser(email, password);
  success(res, result, 'Logged in successfully');
});

exports.getMe = asyncHandler(async (req, res) => {
  success(res, req.user, 'User fetched successfully');
});

exports.logout = asyncHandler(async (req, res) => {
  // Since we use JWT, we can't completely invalidate it unless we use a blacklist.
  // The client should discard the token.
  success(res, null, 'Logged out successfully');
});
