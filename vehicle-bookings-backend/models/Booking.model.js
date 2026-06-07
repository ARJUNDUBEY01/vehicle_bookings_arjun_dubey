const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id:    { type: String, required: true, unique: true, index: true },
  date:          { type: Date,   required: true, index: true },
  time:          { type: String },
  status:        {
    type: String,
    enum: ['Success', 'Canceled by Driver', 'Canceled by Customer', 'Driver Not Found', 'Incomplete'],
    index: true
  },
  customer_id:   { type: String, required: true, index: true },
  vehicle_type:  {
    type: String,
    enum: ['Bike', 'eBike', 'Auto', 'Mini', 'Prime Sedan', 'Prime Plus', 'Prime SUV'],
    index: true
  },
  pickup_location:  { type: String, index: true },
  drop_location:    { type: String, index: true },
  v_tat:            { type: Number, default: null },  // minutes
  c_tat:            { type: Number, default: null },  // minutes
  cancel_reason_customer: { type: String, default: null },
  cancel_reason_driver:   { type: String, default: null },
  is_incomplete:          { type: Boolean, default: null },
  incomplete_reason:      { type: String, default: null },
  booking_value:    { type: Number, required: true, index: true },
  payment_method:   {
    type: String,
    enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', null],
    default: null
  },
  ride_distance:    { type: Number, default: 0 },
  driver_rating:    { type: Number, default: null, min: 0, max: 5 },
  customer_rating:  { type: Number, default: null, min: 0, max: 5 },
}, {
  timestamps: true,
  collection: 'bookings'
});

module.exports = mongoose.model('Booking', bookingSchema);
