const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('../models/Booking.model');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const sanitize = (val) => {
  if (val === 'null' || val === '' || val === undefined || val === null) return null;
  return val;
};

const parseNum = (val) => {
  const n = parseFloat(sanitize(val));
  return isNaN(n) ? null : n;
};

const parseBoolean = (val) => {
    if(sanitize(val) === 'Yes') return true;
    if(sanitize(val) === 'No') return false;
    return null;
}

const importData = async () => {
  try {
    const rawData = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));
    
    const formattedData = rawData.map(item => {
        // Find Date key (handling BOM)
        const dateKey = Object.keys(item).find(key => key.includes('Date'));
        const dateVal = item[dateKey];
        
        return {
            booking_id: sanitize(item['Booking_ID']),
            date: dateVal ? new Date(dateVal) : null,
            time: sanitize(item['Time']),
            status: sanitize(item['Booking_Status']),
            customer_id: sanitize(item['Customer_ID']),
            vehicle_type: sanitize(item['Vehicle_Type']),
            pickup_location: sanitize(item['Pickup_Location']),
            drop_location: sanitize(item['Drop_Location']),
            v_tat: parseNum(item['V_TAT']),
            c_tat: parseNum(item['C_TAT']),
            cancel_reason_customer: sanitize(item['Canceled_Rides_by_Customer']),
            cancel_reason_driver: sanitize(item['Canceled_Rides_by_Driver']),
            is_incomplete: parseBoolean(item['Incomplete_Rides']),
            incomplete_reason: sanitize(item['Incomplete_Rides_Reason']),
            booking_value: parseNum(item['Booking_Value']),
            payment_method: sanitize(item['Payment_Method']),
            ride_distance: parseNum(item['Ride_Distance']) || 0,
            driver_rating: parseNum(item['Driver_Ratings']),
            customer_rating: parseNum(item['Customer_Rating'])
        }
    });

    await Booking.deleteMany();
    console.log('Old Data Destroyed...');
    await Booking.insertMany(formattedData);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else {
    importData(); // Default action for seed script
}
