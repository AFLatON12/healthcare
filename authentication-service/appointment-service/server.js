const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

// Base route
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Auth Service listening on port ${process.env.PORT}`);
});
