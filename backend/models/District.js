const mongoose = require('mongoose');

const monthlyMetricSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
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
  },
  completedWorks: {
    type: Number,
    default: 0
  },
  ongoingWorks: {
    type: Number,
    default: 0
  }
}, { _id: false });

const districtSchema = new mongoose.Schema({
  districtId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  stateCode: {
    type: String,
    required: true
  },
  districtCode: {
    type: String,
    required: true
  },
  monthlyMetrics: [monthlyMetricSchema],
  totalJobCards: {
    type: Number,
    default: 0
  },
  activeWorkers: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    type: String,
    enum: ['API', 'MOCK', 'MANUAL'],
    default: 'MOCK'
  }
}, {
  timestamps: true
});

districtSchema.index({ state: 1, name: 1 });
districtSchema.index({ lastUpdated: -1 });

districtSchema.virtual('latestMetrics').get(function() {
  if (this.monthlyMetrics && this.monthlyMetrics.length > 0) {
    return this.monthlyMetrics[this.monthlyMetrics.length - 1];
  }
  return null;
});

districtSchema.methods.getPerformanceRating = function() {
  const latest = this.latestMetrics;
  if (!latest) return 'No Data';
  
  if (latest.jobsGenerated > 20000) return 'Excellent';
  if (latest.jobsGenerated > 15000) return 'Good';
  if (latest.jobsGenerated > 10000) return 'Average';
  return 'Below Average';
};

districtSchema.set('toJSON', { virtuals: true });
districtSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('District', districtSchema);
