const mongoose = require('mongoose');

// Define the schema for the Division collection
const divisionSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrgUnit',
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, { collection: 'unit-divs' });

// Export the Division model
module.exports = mongoose.model('Division', divisionSchema);
