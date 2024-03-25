const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
(async () => await client.connect())();

client.on("ready", () => {
  console.log("Redis client connected successfully");
});
client.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
const asyncDel = promisify(client.del).bind(client);

const getValue = async (key) => {
  try {
    const value = await asyncGet(key);
    return value;
  } catch (error) {
    console.error("Error getting value from Redis:", error);
    throw error;
  }
};

const setValue = async (key, value) => {
  try {
    await asyncSet(key, value);
    console.log("Value set in Redis");
  } catch (error) {
    console.error("Error setting value in Redis:", error);
    throw error;
  }
};

const deleteKey = async (key) => {
  try {
    const deletedCount = await asyncDel(key);
    console.log(`${deletedCount} key(s) deleted from Redis`);
  } catch (error) {
    console.error("Error deleting key from Redis:", error);
    throw error;
  }
};

module.exports = {
  client,
  getValue,
  setValue,
  deleteKey,
};
