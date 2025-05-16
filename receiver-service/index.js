
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { publish } = require('./publisher');
const { UserModel } = require('./db');

dotenv.config();
const app = express();
app.use(bodyParser.json());

function validateInput(data) {
  const { user, class: cls, age, email } = data;
  return (
    typeof user === 'string' &&
    typeof cls === 'string' &&
    Number.isInteger(age) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

app.post('/receiver', async (req, res) => {
  const data = req.body;
  if (!validateInput(data)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const id = uuidv4();
  const inserted_at = new Date();
  const record = new UserModel({ ...data, id, inserted_at });

  try {
    await record.save();
    await publish({ ...record.toObject() });
    res.status(200).json({ message: 'Data received and published' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process data' });
  }
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Receiver service running...');
  });
});
