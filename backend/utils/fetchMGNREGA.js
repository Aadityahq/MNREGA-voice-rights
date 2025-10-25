const axios = require('axios');
const District = require('../models/District');

// Mock data for development/testing
const mockDistrictData = {
  districtId: 101,
  state: 'Uttar Pradesh',
  name: 'Allahabad',
  monthlyMetrics: [
    { month: '2024-05', jobsGenerated: 12000, wagesPaid: 18000000, workdays: 36000, employmentProvided: 8000 },
    { month: '2024-06', jobsGenerated: 14000, wagesPaid: 21000000, workdays: 42000, employmentProvided: 9000 },
    { month: '2024-07', jobsGenerated: 15000, wagesPaid: 25000000, workdays: 45000, employmentProvided: 10000 },
    { month: '2024-08', jobsGenerated: 16000, wagesPaid: 28000000, workdays: 48000, employmentProvided: 11000 },
    { month: '2024-09', jobsGenerated: 17000, wagesPaid: 30000000, workdays: 51000, employmentProvided: 12000 },
    { month: '2024-10', jobsGenerated: 18000, wagesPaid: 32000000, workdays: 54000, employmentProvided: 13000 }
  ],
  lastUpdated: new Date()
};

const fetchMGNREGAData = async (resourceId) => {
  try {
    const apiUrl = process.env.MGNREGA_API_URL;
    const apiKey = process.env.MGNREGA_API_KEY;
    
    const response = await axios.get(`${apiUrl}${resourceId}`, {
      params: {
        'api-key': apiKey,
        format: 'json',
        limit: 1000
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching MGNREGA data:', error.message);
    throw error;
  }
};

const transformAPIData = (apiData) => {
  try {
    if (!apiData || !apiData.records) {
      return null;
    }
    
    const records = apiData.records;
    const districtMap = {};
    
    records.forEach(record => {
      const districtId = record.district_code || record.lgd_district_code;
      const districtName = record.district_name;
      const stateName = record.state_name;
      
      if (!districtMap[districtId]) {
        districtMap[districtId] = {
          districtId: parseInt(districtId),
          state: stateName,
          name: districtName,
          monthlyMetrics: [],
          lastUpdated: new Date()
        };
      }
      
      const metric = {
        month: record.month || record.financial_year,
        jobsGenerated: parseInt(record.total_persondays || 0),
        wagesPaid: parseFloat(record.total_wages_paid || 0),
        workdays: parseInt(record.total_workdays || 0),
        employmentProvided: parseInt(record.total_households || 0)
      };
      
      districtMap[districtId].monthlyMetrics.push(metric);
    });
    
    return Object.values(districtMap);
  } catch (error) {
    console.error('Error transforming API data:', error);
    return null;
  }
};

const fetchAndStoreData = async (resourceId = '9ef84268-d588-465a-a308-a864a43d0070') => {
  try {
    const apiData = await fetchMGNREGAData(resourceId);
    const transformedData = transformAPIData(apiData);
    
    if (transformedData && transformedData.length > 0) {
      for (const districtData of transformedData) {
        await District.findOneAndUpdate(
          { districtId: districtData.districtId },
          districtData,
          { upsert: true, new: true }
        );
      }
      return transformedData;
    }
    
    console.log('Using mock data as fallback');
    return [mockDistrictData];
  } catch (error) {
    console.error('Error in fetchAndStoreData:', error.message);
    return [mockDistrictData];
  }
};

const getStatesList = async () => {
  try {
    const states = await District.distinct('state');
    
    if (states.length > 0) {
      return states.map((state, index) => ({
        id: index + 1,
        name: state
      }));
    }
    
    return [
      { id: 1, name: 'Uttar Pradesh' },
      { id: 2, name: 'Bihar' },
      { id: 3, name: 'Maharashtra' },
      { id: 4, name: 'Rajasthan' },
      { id: 5, name: 'Madhya Pradesh' }
    ];
  } catch (error) {
    console.error('Error getting states list:', error);
    return [];
  }
};

module.exports = {
  fetchMGNREGAData,
  transformAPIData,
  fetchAndStoreData,
  getStatesList,
  mockDistrictData
};