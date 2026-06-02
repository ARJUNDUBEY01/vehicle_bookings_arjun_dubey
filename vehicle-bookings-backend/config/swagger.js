const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Bookings API',
      version: '1.0.0',
      description: 'API Documentation for the Vehicle Booking Analytics Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
