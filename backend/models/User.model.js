const mongoose = require('mongoose');

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  divisions: [{
    type: String,
    required: true
  }]
}, { collection: 'users' });

// Export the User model
module.exports = mongoose.model('User', userSchema);
