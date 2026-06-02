const Booking = require('../models/Booking.model');
const socket = require('../config/socket');

exports.createBooking = async (data) => {
  const booking = await Booking.create(data);
  try { socket.getIo().emit('booking_created', booking); } catch (e) {}
  return booking;
};

exports.getBookingById = async (id) => {
  const booking = await Booking.findOne({ booking_id: id });
  if (!booking) {
    const error = new Error(`No booking found with ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  return booking;
};

exports.updateBooking = async (id, data) => {
  const booking = await Booking.findOneAndUpdate({ booking_id: id }, data, {
    new: true,
    runValidators: true
  });
  if (!booking) {
    const error = new Error(`No booking found with ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  try { socket.getIo().emit('booking_updated', booking); } catch (e) {}
  return booking;
};

exports.deleteBooking = async (id) => {
  const booking = await Booking.findOneAndDelete({ booking_id: id });
  if (!booking) {
    const error = new Error(`No booking found with ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  try { socket.getIo().emit('booking_deleted', id); } catch (e) {}
  return booking;
};

exports.search = async (keyword) => {
  const regex = new RegExp(keyword, 'i');
  return await Booking.find({
    $or: [
      { pickup_location: regex },
      { drop_location: regex },
      { status: regex },
      { vehicle_type: regex },
      { customer_id: regex },
      { booking_id: regex }
    ]
  }).limit(50);
};
