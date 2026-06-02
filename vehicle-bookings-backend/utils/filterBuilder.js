exports.buildFilter = (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.vehicle) filter.vehicle_type = query.vehicle;
  if (query.payment) filter.payment_method = query.payment;
  if (query.pickup) filter.pickup_location = { $regex: query.pickup, $options: 'i' };
  if (query.drop) filter.drop_location = { $regex: query.drop, $options: 'i' };
  
  if (query.date) {
    const startOfDay = new Date(query.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(query.date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  if (query.minFare || query.maxFare) {
    filter.booking_value = {};
    if (query.minFare) filter.booking_value.$gte = Number(query.minFare);
    if (query.maxFare) filter.booking_value.$lte = Number(query.maxFare);
  }

  if (query.minDistance || query.maxDistance) {
    filter.ride_distance = {};
    if (query.minDistance) filter.ride_distance.$gte = Number(query.minDistance);
    if (query.maxDistance) filter.ride_distance.$lte = Number(query.maxDistance);
  }

  if (query.driverRating) filter.driver_rating = Number(query.driverRating);
  if (query.customerRating) filter.customer_rating = Number(query.customerRating);
  
  if (query.month && query.year) {
      const startDate = new Date(query.year, query.month - 1, 1);
      const endDate = new Date(query.year, query.month, 0, 23, 59, 59, 999);
      if(!filter.date) filter.date = {};
      filter.date.$gte = startDate;
      filter.date.$lte = endDate;
  }

  if (query.hour) {
     // Exact hour matching would ideally require aggregation or storing hour separately, 
     // but we can query using regex on the time string if time is "HH:mm:ss"
     filter.time = { $regex: `^${query.hour.padStart(2, '0')}:`, $options: 'i' };
  }

  if (query.incomplete === 'Yes') filter.is_incomplete = true;
  if (query.cancelledByDriver === 'true') filter.status = 'Canceled by Driver';
  if (query.cancelledByCustomer === 'true') filter.status = 'Canceled by Customer';

  return filter;
};
