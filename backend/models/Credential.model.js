const mongoose = require('mongoose');

// Define the schema for the Credential collection
const credentialSchema = new mongoose.Schema({
  divId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { collection: 'creds' });

// Export the Credential model
module.exports = mongoose.model('Credential', credentialSchema);
