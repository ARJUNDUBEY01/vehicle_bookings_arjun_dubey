const statsService = require('../services/stats.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getTotalBookings = asyncHandler(async (req, res) => {
  const count = await statsService.getTotalBookings();
  success(res, { count }, 'Total bookings fetched');
});

exports.getSuccessRides = asyncHandler(async (req, res) => {
  const data = await statsService.getSuccessRides();
  success(res, data, 'Success rides fetched');
});

exports.getCancelledRides = asyncHandler(async (req, res) => {
  const data = await statsService.getCancelledRides();
  success(res, data, 'Cancelled rides fetched');
});

exports.getIncompleteRides = asyncHandler(async (req, res) => {
  const data = await statsService.getIncompleteRides();
  success(res, data, 'Incomplete rides fetched');
});

exports.getDriverNotFound = asyncHandler(async (req, res) => {
  const count = await statsService.getDriverNotFound();
  success(res, { count }, 'Driver not found count fetched');
});

exports.getTotalCustomers = asyncHandler(async (req, res) => {
  const count = await statsService.getTotalCustomers();
  success(res, { count }, 'Total customers fetched');
});

exports.getTopVehicle = asyncHandler(async (req, res) => {
  const data = await statsService.getTopVehicle();
  success(res, data, 'Top vehicle fetched');
});

exports.getTopPaymentMethod = asyncHandler(async (req, res) => {
  const data = await statsService.getTopPaymentMethod();
  success(res, data, 'Top payment method fetched');
});

exports.getRevenueByVehicle = asyncHandler(async (req, res) => {
  const data = await statsService.getRevenueByVehicle();
  success(res, data, 'Revenue by vehicle fetched');
});

exports.getBookingsByHour = asyncHandler(async (req, res) => {
  const data = await statsService.getBookingsByHour();
  success(res, data, 'Bookings by hour fetched');
});

exports.getTopRoutes = asyncHandler(async (req, res) => {
  const data = await statsService.getTopRoutes();
  success(res, data, 'Top routes fetched');
});

exports.getGeneralStats = asyncHandler(async (req, res) => {
  const data = await statsService.getGeneralStats();
  success(res, data, 'General stats fetched');
});
