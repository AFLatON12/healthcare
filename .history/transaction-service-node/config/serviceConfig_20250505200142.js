module.exports = {
  port: process.env.PORT || 8082,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  mongoDbName: process.env.MONGO_DB_NAME || 'transactiondb',
};
