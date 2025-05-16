
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { subscribeToEvents } = require('./subscriber');
const { UserModel } = require('./db');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Listener DB connected');
  subscribeToEvents(async (message) => {
    const data = JSON.parse(message);
    data.modified_at = new Date();
    const updatedDoc = new UserModel(data);
    await updatedDoc.save();
    console.log('Data copied to second collection');
  });
});
