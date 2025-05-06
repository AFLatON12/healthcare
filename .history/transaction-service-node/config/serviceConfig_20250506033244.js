module.exports = {
  port: process.env.PORT || 8082,
  mongoUri: process.env.MONGO_URI || `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}`,
  mongoDbName: process.env.MONGO_DB_NAME || 'transactiondb',
};
