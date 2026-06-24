export const findOne = async ({
  model,
  filter = {},
  select = "",
  options = {},
}) => {
  const doc = model.findOne(filter);

  if (select.length) doc.select(select);
  if (options.populate) doc.populate(options.populate);
  if (options.lean) doc.lean(options.lean);

  return await doc.exec();
};

export const create = async ({ model, data, options = {} }) => {
  return await model.create(data, { validateBeforeSave: true, ...options });
};

export const findById = async ({ model, id, select = "", options = {} }) => {
  const doc = model.findById(id);

  if (select.length) doc.select(select);
  if (options.populate) doc.populate(options.populate);
  if (options.lean) doc.lean(options.lean);

  return await doc.exec();
};

export const find = async ({
  model,
  filter = {},
  options = {},
  select = "",
}) => {
  const docs = model.find(filter);

  if (select.length) docs.select(select);
  if (options.lean) docs.lean(options.lean);
  if (options.populate) docs.populate(options.populate);
  // sort skip limit
  if (options.sort) docs.sort(options.sort);
  if (options.skip) docs.skip(options.skip);
  if (options.limit) docs.limit(options.limit);

  return await docs.exec();
};

export const insertMany = async ({ model, data }) => {
  return await model.insertMany(data);
};

export const updateOne = async ({ model, filter, data, options = {} }) => {
  return await model.updateOne(filter, { $set: data, $inc: { __v: 1 } }, options);
};

export const findOneAndUpdate = async ({
  model,
  filter,
  data,
  options = {},
}) => {
  return await model.findOneAndUpdate(
    filter,
    { $set: data, $inc: { __v: 1 } },
    { ...options, new: true, runValidators: true },
  );
};

export const findByIdAndUpdate = async ({
  model,
  id,
  data,
  select = "",
  options = {},
}) => {
  const doc = model.findByIdAndUpdate(
    id,
    { $set: data, $inc: { __v: 1 } },
    { ...options, runValidators: true, new: true },
  );

  if (select?.length) doc.select(select);

  return await doc.exec();
};

export const deleteOne = async ({ model, filter }) => {
  return await model.deleteOne(filter);
};

export const deleteMany = async ({ model, filter }) => {
  return await model.deleteMany(filter);
};

export const findOneAndDelete = async ({ model, filter }) => {
  return await model.findOneAndDelete(filter);
};

export const findByIdAndDelete = async ({ model, id }) => {
  return await model.findByIdAndDelete(id);
};

export const findOneAndReplace = async ({ model, filter, data, options = {} }) => {
  return await model.findOneAndReplace(filter, data, {
    new: true,
    runValidators: true,
    ...options,
  });
};

export const updateMany = async ({model, filter, data}) => {
  return await model.updateMany(filter, {$set: data});
}

export const aggregate = async ({model, pipeline}) => {
  return await model.aggregate(pipeline);
}