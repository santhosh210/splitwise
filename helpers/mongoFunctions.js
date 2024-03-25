const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Splitwise");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const findOne = async (collection, query) => {
  try {
    const model = mongoose.model(collection);
    const result = await model.findOne(query);
    return result;
  } catch (error) {
    console.error(`Error finding ${collection} collection:`, error);
    throw error;
  }
};

const createOne = async (collection, data) => {
  try {
    console.log(collection, data);
    const model = mongoose.model(collection);
    const newItem = new model(data);
    const savedItem = await newItem.save();
    console.log(`${collection} collection created successfully:`, savedItem);
    return savedItem;
  } catch (error) {
    console.error(`Error creating ${collection} collection:`, error);
    throw error;
  }
};

const findAll = async (collection) => {
  try {
    const model = mongoose.model(collection);
    const allItems = await model.find();
    return allItems;
  } catch (error) {
    console.error(`Error finding all ${collection} collections:`, error);
    throw error;
  }
};

const findById = async (collection, id) => {
  try {
    const model = mongoose.model(collection);
    const item = await model.findById(id);
    return item;
  } catch (error) {
    console.error(`Error finding ${collection} by ID:`, error);
    throw error;
  }
};

const addMany = async (collection, data) => {
  try {
    const model = mongoose.model(collection);
    const insertedItems = await model.insertMany(data);
    console.log(`${collection} collection items added successfully.`);
    return insertedItems;
  } catch (error) {
    console.error(`Error adding items to ${collection} collection:`, error);
    throw error;
  }
};

const findByIdAndUpdate = async (collection, id, update) => {
  try {
    const model = mongoose.model(collection);
    const updatedItem = await model.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updatedItem) {
      throw new Error(`No ${collection} found with ID ${id}`);
    }
    console.log(`${collection} updated successfully:`, updatedItem);
    return updatedItem;
  } catch (error) {
    console.error(`Error updating ${collection} by ID:`, error);
    throw error;
  }
};

const findOneAndUpdate = async (collection, query, update) => {
  try {
    const model = mongoose.model(collection);
    const updatedItem = await model.findOneAndUpdate(query, update, {
      new: true,
    });
    if (!updatedItem) {
      throw new Error(`No ${collection} found with the provided query`);
    }
    console.log(`${collection} updated successfully:`, updatedItem);
    return updatedItem;
  } catch (error) {
    console.error(`Error updating ${collection}:`, error);
    throw error;
  }
};

const deleteOne = async (collection, query) => {
  try {
    const model = mongoose.model(collection);
    const deletedItem = await model.findOneAndDelete(query);
    if (!deletedItem) {
      throw new Error(`No ${collection} found with the provided query`);
    }
    console.log(`${collection} deleted successfully:`, deletedItem);
    return deletedItem;
  } catch (error) {
    console.error(`Error deleting ${collection}:`, error);
    throw error;
  }
};

const deleteMany = async (collection, query) => {
  try {
    const model = mongoose.model(collection);
    const deletedItems = await model.deleteMany(query);
    console.log(
      `${deletedItems.deletedCount} ${collection} items deleted successfully.`
    );
    return deletedItems;
  } catch (error) {
    console.error(`Error deleting ${collection}:`, error);
    throw error;
  }
};

module.exports = {
  db,
  findOne,
  createOne,
  findAll,
  findById,
  addMany,
  findByIdAndUpdate,
  findOneAndUpdate,
  deleteOne,
  deleteMany,
};
