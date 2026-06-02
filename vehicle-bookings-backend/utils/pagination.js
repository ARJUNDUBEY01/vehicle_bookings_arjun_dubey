exports.paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  let sortParams = {};
  if (options.sort) {
    const parts = options.sort.split(',');
    parts.forEach(part => {
      if (part.startsWith('-')) {
        sortParams[part.substring(1)] = -1;
      } else {
        sortParams[part] = 1;
      }
    });
  } else {
    sortParams = { createdAt: -1 }; // default sort
  }

  const total = await model.countDocuments(query);
  const data = await model.find(query).sort(sortParams).skip(startIndex).limit(limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  };
};
