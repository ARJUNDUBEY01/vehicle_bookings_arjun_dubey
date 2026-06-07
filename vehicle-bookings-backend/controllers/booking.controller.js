const bookingService = require('../services/booking.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildFilter } = require('../utils/filterBuilder');
const { paginate } = require('../utils/pagination');
const Booking = require('../models/Booking.model');
const { Parser } = require('json2csv');

exports.getAllBookings = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const result = await paginate(Booking, filter, req.query);
  success(res, result.data, 'Bookings fetched successfully', 200, result.pagination);
});

exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  success(res, booking, 'Booking fetched successfully');
});

exports.createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  success(res, booking, 'Booking created successfully', 201);
});

exports.updateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBooking(req.params.id, req.body);
  success(res, booking, 'Booking updated successfully');
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new Error('Status is required');
  const booking = await bookingService.updateBooking(req.params.id, { status });
  success(res, booking, 'Booking status updated successfully');
});

exports.updateBookingPayment = asyncHandler(async (req, res) => {
  const { payment_method } = req.body;
  if (!payment_method) throw new Error('payment_method is required');
  const booking = await bookingService.updateBooking(req.params.id, { payment_method });
  success(res, booking, 'Booking payment method updated successfully');
});

exports.updateBookingRating = asyncHandler(async (req, res) => {
  const { driver_rating, customer_rating } = req.body;
  const booking = await bookingService.updateBooking(req.params.id, { driver_rating, customer_rating });
  success(res, booking, 'Booking ratings updated successfully');
});

exports.updateBookingFare = asyncHandler(async (req, res) => {
  const { booking_value } = req.body;
  if (booking_value === undefined) throw new Error('booking_value is required');
  const booking = await bookingService.updateBooking(req.params.id, { booking_value });
  success(res, booking, 'Booking fare updated successfully');
});

exports.deleteBooking = asyncHandler(async (req, res) => {
  await bookingService.deleteBooking(req.params.id);
  success(res, null, 'Booking deleted successfully');
});

exports.exportBookingsCsv = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const bookings = await Booking.find(filter).lean();
  
  if (!bookings || bookings.length === 0) {
    return success(res, [], 'No bookings found to export', 404);
  }

  const fields = ['booking_id', 'date', 'time', 'status', 'customer_id', 'vehicle_type', 'pickup_location', 'drop_location', 'booking_value', 'payment_method'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(bookings);

  res.header('Content-Type', 'text/csv');
  res.attachment('bookings.csv');
  return res.send(csv);
});
