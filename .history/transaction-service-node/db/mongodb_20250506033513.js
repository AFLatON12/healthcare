const { MongoClient } = require('mongodb');
const serviceConfig = require('../config/serviceConfig');

let client;
let db;

async function connectMongoDB() {
  if (db) return db;
  console.log('Connecting to MongoDB with URI:', serviceConfig.mongoUri);
  client = new MongoClient(serviceConfig.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db(serviceConfig.mongoDbName);
  console.log('Connected to MongoDB');
  return db;
}

async function disconnectMongoDB() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  getDB,
};
