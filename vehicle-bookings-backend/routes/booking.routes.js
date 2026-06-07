const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  updateBookingPayment,
  updateBookingRating,
  updateBookingFare,
  deleteBooking,
  exportBookingsCsv
} = require('../controllers/booking.controller');

const router = express.Router();

router.get('/export', exportBookingsCsv);

router.route('/')
  .get(getAllBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/payment', updateBookingPayment);
router.patch('/:id/rating', updateBookingRating);
router.patch('/:id/fare', updateBookingFare);

module.exports = router;
