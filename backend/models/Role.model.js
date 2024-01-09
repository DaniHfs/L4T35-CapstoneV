const mongoose = require('mongoose');

// Define the schema for the Role collection
const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    type: [String],
    required: true
  }
}, { collection: 'roles' });

// Export the Role model
module.exports = mongoose.model('Role', roleSchema);
