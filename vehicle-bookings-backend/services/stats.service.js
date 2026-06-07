const Booking = require('../models/Booking.model');

exports.getTotalBookings = async () => {
  return await Booking.countDocuments();
};

exports.getSuccessRides = async () => {
  const count = await Booking.countDocuments({ status: 'Success' });
  const total = await this.getTotalBookings();
  return {
    count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(2) + '%' : '0%'
  };
};

exports.getCancelledRides = async () => {
  const byDriver = await Booking.countDocuments({ status: 'Canceled by Driver' });
  const byCustomer = await Booking.countDocuments({ status: 'Canceled by Customer' });
  return {
    total: byDriver + byCustomer,
    byDriver,
    byCustomer
  };
};

exports.getIncompleteRides = async () => {
  const count = await Booking.countDocuments({ is_incomplete: true });
  const reasons = await Booking.aggregate([
    { $match: { is_incomplete: true } },
    { $group: { _id: '$incomplete_reason', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return { count, reasons };
};

exports.getDriverNotFound = async () => {
  return await Booking.countDocuments({ status: 'Driver Not Found' });
};

exports.getTotalCustomers = async () => {
  const result = await Booking.distinct('customer_id');
  return result.length;
};

exports.getTopVehicle = async () => {
  const result = await Booking.aggregate([
    { $group: { _id: '$vehicle_type', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  return result[0];
};

exports.getTopPaymentMethod = async () => {
  const result = await Booking.aggregate([
    { $match: { payment_method: { $ne: null } } },
    { $group: { _id: '$payment_method', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  return result[0];
};

exports.getRevenueByVehicle = async () => {
  return await Booking.aggregate([
    { $match: { status: 'Success' } },
    { $group: { _id: '$vehicle_type', totalRevenue: { $sum: '$booking_value' }, count: { $sum: 1 } } },
    { $sort: { totalRevenue: -1 } }
  ]);
};

exports.getBookingsByHour = async () => {
  return await Booking.aggregate([
    { $project: { hour: { $hour: '$date' } } },
    { $group: { _id: '$hour', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

exports.getTopRoutes = async () => {
  return await Booking.aggregate([
    { $match: { status: 'Success', pickup_location: { $ne: null }, drop_location: { $ne: null } } },
    { $group: { _id: { from: '$pickup_location', to: '$drop_location' }, count: { $sum: 1 }, avgFare: { $avg: '$booking_value' } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
};

exports.getGeneralStats = async () => {
  const maxFareResult = await Booking.findOne().sort('-booking_value').select('booking_value');
  const minFareResult = await Booking.findOne({ status: 'Success' }).sort('booking_value').select('booking_value');
  
  const avgStats = await Booking.aggregate([
    { $match: { status: 'Success' } },
    { 
      $group: { 
        _id: null, 
        avgFare: { $avg: '$booking_value' },
        avgDistance: { $avg: '$ride_distance' },
        avgDriverRating: { $avg: '$driver_rating' },
        avgCustomerRating: { $avg: '$customer_rating' }
      } 
    }
  ]);

  return {
    highestFare: maxFareResult ? maxFareResult.booking_value : 0,
    lowestFare: minFareResult ? minFareResult.booking_value : 0,
    averages: avgStats[0] || {}
  };
};
