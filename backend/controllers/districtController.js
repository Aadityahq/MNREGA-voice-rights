const District = require('../models/District');

exports.getStates = async (req, res) => {
  try {
    const states = await District.aggregate([
      { $group: { _id: '$state', districtCount: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', districtCount: 1 } },
      { $sort: { name: 1 } }
    ]);
    res.json({ success: true, count: states.length, data: states });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDistrictsByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    const districts = await District.find({ state: stateName }).select('districtId name state monthlyMetrics').lean();
    res.json({ success: true, state: stateName, count: districts.length, data: districts });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllDistricts = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const districts = await District.find().skip(skip).limit(parseInt(limit)).lean();
    const total = await District.countDocuments();
    res.json({
      success: true,
      data: districts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    console.error('Error fetching all districts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Looking for district ID:', id);
    const district = await District.findOne({ districtId: id }).lean();
    if (!district) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }
    res.json({ success: true, data: district });
  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const totalDistricts = await District.countDocuments();
    const states = await District.distinct('state');
    const totalStates = states.length;
    const aggregateStats = await District.aggregate([
      { $project: { latestMetrics: { $arrayElemAt: ['$monthlyMetrics', -1] } } },
      { $group: { _id: null, totalJobs: { $sum: '$latestMetrics.jobsGenerated' }, totalWages: { $sum: '$latestMetrics.wagesPaid' } } }
    ]);
    res.json({
      success: true,
      data: { totalDistricts, totalStates, totalJobs: aggregateStats[0]?.totalJobs || 0, totalWages: aggregateStats[0]?.totalWages || 0 }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAudioSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const district = await District.findOne({ districtId: id }).lean();
    if (!district) {
      return res.status(404).json({ success: false, error: 'District not found' });
    }
    const latest = district.monthlyMetrics[district.monthlyMetrics.length - 1];
    if (!latest) {
      return res.json({ success: true, summary: `No data available for ${district.name}.` });
    }
    const summary = `MGNREGA Report for ${district.name} district in ${district.state} state. In ${latest.month} ${latest.year}, ${latest.jobsGenerated.toLocaleString()} jobs were generated.`;
    res.json({ success: true, summary });
  } catch (error) {
    console.error('Error generating audio summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.fetchData = async (req, res) => {
  try {
    res.json({ success: true, message: 'Data fetch feature coming soon' });
  } catch (error) {
    console.error('Error in fetchData:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};