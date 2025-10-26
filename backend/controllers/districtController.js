const District = require('../models/District');
const { getRedisClient } = require('../config/redis');

const getCachedData = async (key, fetchFunction, ttl = 14400) => {
  try {
    const redisClient = getRedisClient();
    
    if (!redisClient) {
      return await fetchFunction();
    }

    const cached = await redisClient.get(key);
    if (cached) {
      console.log(`✅ Cache hit: ${key}`);
      return JSON.parse(cached);
    }

    console.log(`⚠️ Cache miss: ${key}`);
    const data = await fetchFunction();

    if (data) {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return await fetchFunction();
  }
};

exports.getStates = async (req, res) => {
  try {
    const states = await getCachedData('all_states', async () => {
      const aggregation = await District.aggregate([
        {
          $group: {
            _id: '$state',
            districtCount: { $sum: 1 },
            totalJobs: { $sum: { $arrayElemAt: ['$monthlyMetrics.jobsGenerated', -1] } },
            totalWages: { $sum: { $arrayElemAt: ['$monthlyMetrics.wagesPaid', -1] } },
            lastUpdated: { $max: '$lastUpdated' }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            districtCount: 1,
            totalJobs: 1,
            totalWages: 1,
            lastUpdated: 1
          }
        },
        { $sort: { name: 1 } }
      ]);

      return aggregation;
    }, 7200);

    res.json({
      success: true,
      count: states.length,
      data: states
    });

  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
      message: error.message
    });
  }
};

exports.getDistrictsByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    const { sortBy = 'name', order = 'asc', search } = req.query;

    if (!stateName) {
      return res.status(400).json({
        success: false,
        error: 'State name is required'
      });
    }

    const cacheKey = `districts:${stateName}:${sortBy}:${order}:${search || 'all'}`;
    
    const districts = await getCachedData(cacheKey, async () => {
      let query = { state: stateName };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;

      return await District.find(query)
        .select('districtId name state monthlyMetrics lastUpdated')
        .sort(sortOptions)
        .lean();
    }, 3600);

    res.json({
      success: true,
      state: stateName,
      count: districts.length,
      data: districts
    });

  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch districts',
      message: error.message
    });
  }
};

exports.getAllDistricts = async (req, res) => {
  try {
    const {
      state,
      search,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (state) query.state = state;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [districts, total] = await Promise.all([
      District.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      District.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: districts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching all districts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch districts',
      message: error.message
    });
  }
};

exports.getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `district:${id}`;
    
    const district = await getCachedData(cacheKey, async () => {
      return await District.findOne({ 
        $or: [
          { districtId: id },
          { _id: id }
        ]
      }).lean();
    }, 3600);

    if (!district) {
      return res.status(404).json({
        success: false,
        error: 'District not found'
      });
    }

    res.json({
      success: true,
      data: district
    });

  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch district',
      message: error.message
    });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const stats = await getCachedData('statistics', async () => {
      const [
        totalDistricts,
        totalStates,
        aggregateStats
      ] = await Promise.all([
        District.countDocuments(),
        District.distinct('state').then(states => states.length),
        District.aggregate([
          {
            $project: {
              latestMetrics: { $arrayElemAt: ['$monthlyMetrics', -1] }
            }
          },
          {
            $group: {
              _id: null,
              totalJobs: { $sum: '$latestMetrics.jobsGenerated' },
              totalWages: { $sum: '$latestMetrics.wagesPaid' },
              totalWorkdays: { $sum: '$latestMetrics.workdays' },
              totalEmployment: { $sum: '$latestMetrics.employmentProvided' }
            }
          }
        ])
      ]);

      return {
        totalDistricts,
        totalStates,
        ...(aggregateStats[0] || {})
      };
    }, 7200);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

exports.getAudioSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const district = await District.findOne({ 
      $or: [{ districtId: id }, { _id: id }]
    }).lean();

    if (!district) {
      return res.status(404).json({
        success: false,
        error: 'District not found'
      });
    }

    const latest = district.monthlyMetrics[district.monthlyMetrics.length - 1];

    if (!latest) {
      return res.json({
        success: true,
        summary: `No data available for ${district.name} district in ${district.state} state.`
      });
    }

    const summary = `
      MGNREGA Report for ${district.name} district in ${district.state} state.
      
      In ${latest.month} ${latest.year}, ${latest.jobsGenerated.toLocaleString()} jobs were generated.
      
      Total wages paid amount to ${(latest.wagesPaid / 10000000).toFixed(2)} crore rupees.
      
      ${latest.workdays.toLocaleString()} workdays were provided.
      
      Employment was given to ${latest.employmentProvided.toLocaleString()} people.
      
      This data was last updated on ${new Date(district.lastUpdated).toLocaleDateString()}.
    `;

    res.json({
      success: true,
      summary: summary.trim()
    });

  } catch (error) {
    console.error('Error generating audio summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio summary'
    });
  }
};

exports.fetchData = async (req, res) => {
  try {
    const { fetchAllDistrictsData } = require('../utils/fetchMGNREGA');
    
    console.log('🔄 Manual data fetch triggered...');
    
    fetchAllDistrictsData().then(() => {
      console.log('✅ Background data fetch completed');
    }).catch(err => {
      console.error('❌ Background fetch error:', err);
    });
    
    res.json({
      success: true,
      message: 'Data fetch started in background. This may take several minutes.'
    });

  } catch (error) {
    console.error('Error triggering fetch:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger data fetch'
    });
  }
};
