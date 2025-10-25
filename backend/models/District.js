const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  districtId: {
    type: Number,
    required: true,
    unique: true
  },
  state: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  monthlyMetrics: [{
    month: {
      type: String,
      required: true
    },
    jobsGenerated: {
      type: Number,
      default: 0
    },
    wagesPaid: {
      type: Number,
      default: 0
    },
    workdays: {
      type: Number,
      default: 0
    },
    employmentProvided: {
      type: Number,
      default: 0
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
districtSchema.index({ state: 1, name: 1 });
districtSchema.index({ districtId: 1 });

module.exports = mongoose.model('District', districtSchema);