const NodeCache = require('node-cache');

// StdTTL is the default time to live in seconds
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

exports.cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  // Generate a cache key based on URL and query params
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.status(200).json(cachedResponse);
  } else {
    console.log(`Cache miss for ${key}`);
    
    // Intercept res.json to cache the response before sending it
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode === 200 && body && body.success) {
        cache.set(key, body);
      }
      return originalJson.call(res, body);
    };
    next();
  }
};

exports.clearCache = (req, res, next) => {
  cache.flushAll();
  next();
};
