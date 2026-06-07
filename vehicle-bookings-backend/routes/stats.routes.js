const express = require('express');
const {
  getTotalBookings,
  getSuccessRides,
  getCancelledRides,
  getIncompleteRides,
  getDriverNotFound,
  getTotalCustomers,
  getTopVehicle,
  getTopPaymentMethod,
  getRevenueByVehicle,
  getBookingsByHour,
  getTopRoutes,
  getGeneralStats
} = require('../controllers/stats.controller');
const { cacheMiddleware } = require('../middlewares/cache.middleware');

const router = express.Router();

router.use(cacheMiddleware);

router.get('/total-bookings', getTotalBookings);
router.get('/success-rides', getSuccessRides);
router.get('/cancelled-rides', getCancelledRides);
router.get('/incomplete-rides', getIncompleteRides);
router.get('/driver-not-found', getDriverNotFound);
router.get('/total-customers', getTotalCustomers);
router.get('/top-vehicle', getTopVehicle);
router.get('/top-payment-method', getTopPaymentMethod);
router.get('/revenue-by-vehicle', getRevenueByVehicle);
router.get('/bookings-by-hour', getBookingsByHour);
router.get('/top-routes', getTopRoutes);
// A combined route for multiple stats
router.get('/general', getGeneralStats);

module.exports = router;
