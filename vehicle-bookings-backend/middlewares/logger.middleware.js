const morgan = require('morgan');

// We can export morgan instances here for reuse
exports.devLogger = morgan('dev');
exports.prodLogger = morgan('combined');
