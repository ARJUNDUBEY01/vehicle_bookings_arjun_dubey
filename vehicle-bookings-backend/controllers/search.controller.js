const bookingService = require('../services/booking.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildFilter } = require('../utils/filterBuilder');
const { paginate } = require('../utils/pagination');
const Booking = require('../models/Booking.model');

exports.search = asyncHandler(async (req, res) => {
  if (req.query.keyword) {
    const data = await bookingService.search(req.query.keyword);
    return success(res, data, 'Search completed');
  }

  // Handle specific searches like ?bookingId=... or ?customerId=... using filter builder
  const filter = buildFilter(req.query);
  if (req.query.bookingId) filter.booking_id = req.query.bookingId;
  if (req.query.customerId) filter.customer_id = req.query.customerId;
  if (req.query.type) filter.vehicle_type = req.query.type;
  if (req.query.method) filter.payment_method = req.query.method;

  const result = await paginate(Booking, filter, req.query);
  success(res, result.data, 'Search completed', 200, result.pagination);
});
