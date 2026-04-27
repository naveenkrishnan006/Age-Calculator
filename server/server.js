const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', require('./routes/calculate'));

app.get('/', (req, res) => {
  res.json({ message: 'Age Calculator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

