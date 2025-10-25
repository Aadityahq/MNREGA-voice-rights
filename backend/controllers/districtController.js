const District = require('../models/District');
const { setCache, getCache } = require('../config/redis');
const { fetchAndStoreData, getStatesList, mockDistrictData } = require('../utils/fetchMGNREGA');

/**
 * Get list of all states
 * @route GET /api/states
 */
const getStates = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'states_list';
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        source: 'cache'
      });
    }
    
    // Fetch from database
    const states = await getStatesList();
    
    // Cache for 24 hours
    await setCache(cacheKey, states, 86400);
    
    res.json({
      success: true,
      data: states,
      source: 'database'
    });
  } catch (error) {
    console.error('Error in getStates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching states',
      error: error.message
    });
  }
};

/**
 * Get district by ID with metrics and trends
 * @route GET /api/districts/:id
 */
const getDistrictById = async (req, res) => {
  try {
    const districtId = parseInt(req.params.id);
    
    // Check cache first
    const cacheKey = `district_${districtId}`;
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        source: 'cache'
      });
    }
    
    // Fetch from database
    let district = await District.findOne({ districtId });
    
    if (!district) {
      // If not in DB, try to fetch from API
      console.log(`District ${districtId} not found in DB, fetching from API...`);
      await fetchAndStoreData();
      district = await District.findOne({ districtId });
      
      // If still not found, use mock data
      if (!district) {
        console.log('Using mock data for district');
        district = mockDistrictData;
      }
    }
    
    // Cache for 1 hour
    await setCache(cacheKey, district, 3600);
    
    res.json({
      success: true,
      data: district,
      source: 'database'
    });
  } catch (error) {
    console.error('Error in getDistrictById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching district data',
      error: error.message
    });
  }
};

/**
 * Get audio summary for district
 * @route GET /api/districts/:id/audio-summary
 */
const getAudioSummary = async (req, res) => {
  try {
    const districtId = parseInt(req.params.id);
    
    // Get district data
    let district = await District.findOne({ districtId });
    
    if (!district) {
      district = mockDistrictData;
    }
    
    // Get latest month data
    const latestMetrics = district.monthlyMetrics[district.monthlyMetrics.length - 1];
    
    if (!latestMetrics) {
      return res.status(404).json({
        success: false,
        message: 'No metrics available for this district'
      });
    }
    
    // Generate simple summary text
    const summary = `In ${district.name} district of ${district.state}, ` +
      `${latestMetrics.jobsGenerated.toLocaleString()} jobs were generated this month. ` +
      `Total wages of ${(latestMetrics.wagesPaid / 10000000).toFixed(2)} crore rupees were paid. ` +
      `This created ${latestMetrics.workdays.toLocaleString()} workdays for the people. ` +
      `${latestMetrics.employmentProvided.toLocaleString()} households received employment.`;
    
    res.json({
      success: true,
      summary: summary,
      data: {
        districtName: district.name,
        state: district.state,
        month: latestMetrics.month,
        metrics: latestMetrics
      }
    });
  } catch (error) {
    console.error('Error in getAudioSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating audio summary',
      error: error.message
    });
  }
};

/**
 * Get districts by state
 * @route GET /api/states/:stateName/districts
 */
const getDistrictsByState = async (req, res) => {
  try {
    const stateName = req.params.stateName;
    
    const districts = await District.find({ state: stateName }).select('districtId name state');
    
    res.json({
      success: true,
      data: districts
    });
  } catch (error) {
    console.error('Error in getDistrictsByState:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching districts',
      error: error.message
    });
  }
};

module.exports = {
  getStates,
  getDistrictById,
  getAudioSummary,
  getDistrictsByState
};