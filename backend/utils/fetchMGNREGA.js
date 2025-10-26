const axios = require('axios');
const District = require('../models/District');

const STATE_CODES = {
  '01': 'Andhra Pradesh', '02': 'Arunachal Pradesh', '03': 'Assam',
  '04': 'Bihar', '05': 'Chhattisgarh', '06': 'Goa',
  '07': 'Gujarat', '08': 'Haryana', '09': 'Himachal Pradesh',
  '10': 'Jammu and Kashmir', '11': 'Jharkhand', '12': 'Karnataka',
  '13': 'Kerala', '14': 'Madhya Pradesh', '15': 'Maharashtra',
  '16': 'Manipur', '17': 'Meghalaya', '18': 'Mizoram',
  '19': 'Nagaland', '20': 'Odisha', '21': 'Punjab',
  '22': 'Rajasthan', '23': 'Sikkim', '24': 'Tamil Nadu',
  '25': 'Tripura', '26': 'Uttar Pradesh', '27': 'Uttarakhand',
  '28': 'West Bengal', '29': 'Andaman and Nicobar', '30': 'Chandigarh',
  '31': 'Dadra and Nagar Haveli', '32': 'Daman and Diu',
  '33': 'Lakshadweep', '34': 'Puducherry',
  '35': 'Ladakh', '36': 'Telangana'
};

const MOCK_DISTRICTS = [
  // Uttar Pradesh
  { stateCode: '26', districtCode: '001', name: 'Prayagraj', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '002', name: 'Varanasi', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '003', name: 'Lucknow', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '004', name: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '005', name: 'Agra', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '006', name: 'Meerut', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '007', name: 'Gorakhpur', state: 'Uttar Pradesh' },
  { stateCode: '26', districtCode: '008', name: 'Bareilly', state: 'Uttar Pradesh' },
  
  // Bihar
  { stateCode: '04', districtCode: '001', name: 'Patna', state: 'Bihar' },
  { stateCode: '04', districtCode: '002', name: 'Gaya', state: 'Bihar' },
  { stateCode: '04', districtCode: '003', name: 'Bhagalpur', state: 'Bihar' },
  { stateCode: '04', districtCode: '004', name: 'Muzaffarpur', state: 'Bihar' },
  { stateCode: '04', districtCode: '005', name: 'Darbhanga', state: 'Bihar' },
  { stateCode: '04', districtCode: '006', name: 'Arrah', state: 'Bihar' },
  
  // Maharashtra
  { stateCode: '15', districtCode: '001', name: 'Mumbai', state: 'Maharashtra' },
  { stateCode: '15', districtCode: '002', name: 'Pune', state: 'Maharashtra' },
  { stateCode: '15', districtCode: '003', name: 'Nagpur', state: 'Maharashtra' },
  { stateCode: '15', districtCode: '004', name: 'Nashik', state: 'Maharashtra' },
  { stateCode: '15', districtCode: '005', name: 'Aurangabad', state: 'Maharashtra' },
  
  // Rajasthan
  { stateCode: '22', districtCode: '001', name: 'Jaipur', state: 'Rajasthan' },
  { stateCode: '22', districtCode: '002', name: 'Jodhpur', state: 'Rajasthan' },
  { stateCode: '22', districtCode: '003', name: 'Udaipur', state: 'Rajasthan' },
  { stateCode: '22', districtCode: '004', name: 'Kota', state: 'Rajasthan' },
  { stateCode: '22', districtCode: '005', name: 'Ajmer', state: 'Rajasthan' },
  
  // Madhya Pradesh
  { stateCode: '14', districtCode: '001', name: 'Bhopal', state: 'Madhya Pradesh' },
  { stateCode: '14', districtCode: '002', name: 'Indore', state: 'Madhya Pradesh' },
  { stateCode: '14', districtCode: '003', name: 'Jabalpur', state: 'Madhya Pradesh' },
  { stateCode: '14', districtCode: '004', name: 'Gwalior', state: 'Madhya Pradesh' },
  
  // West Bengal
  { stateCode: '28', districtCode: '001', name: 'Kolkata', state: 'West Bengal' },
  { stateCode: '28', districtCode: '002', name: 'Howrah', state: 'West Bengal' },
  { stateCode: '28', districtCode: '003', name: 'Darjeeling', state: 'West Bengal' },
  { stateCode: '28', districtCode: '004', name: 'Jalpaiguri', state: 'West Bengal' },
  
  // Tamil Nadu
  { stateCode: '24', districtCode: '001', name: 'Chennai', state: 'Tamil Nadu' },
  { stateCode: '24', districtCode: '002', name: 'Coimbatore', state: 'Tamil Nadu' },
  { stateCode: '24', districtCode: '003', name: 'Madurai', state: 'Tamil Nadu' },
  { stateCode: '24', districtCode: '004', name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  
  // Karnataka
  { stateCode: '12', districtCode: '001', name: 'Bengaluru', state: 'Karnataka' },
  { stateCode: '12', districtCode: '002', name: 'Mysuru', state: 'Karnataka' },
  { stateCode: '12', districtCode: '003', name: 'Mangaluru', state: 'Karnataka' },
  { stateCode: '12', districtCode: '004', name: 'Hubli', state: 'Karnataka' },
  
  // Gujarat
  { stateCode: '07', districtCode: '001', name: 'Ahmedabad', state: 'Gujarat' },
  { stateCode: '07', districtCode: '002', name: 'Surat', state: 'Gujarat' },
  { stateCode: '07', districtCode: '003', name: 'Vadodara', state: 'Gujarat' },
  { stateCode: '07', districtCode: '004', name: 'Rajkot', state: 'Gujarat' },
  
  // Telangana
  { stateCode: '36', districtCode: '001', name: 'Hyderabad', state: 'Telangana' },
  { stateCode: '36', districtCode: '002', name: 'Warangal', state: 'Telangana' },
  { stateCode: '36', districtCode: '003', name: 'Nizamabad', state: 'Telangana' }
];

const generateMonthlyMetrics = () => {
  const metrics = [];
  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    
    metrics.push({
      month: months[monthIndex],
      year: year,
      jobsGenerated: Math.floor(Math.random() * 20000) + 10000,
      wagesPaid: Math.floor(Math.random() * 60000000) + 40000000,
      workdays: Math.floor(Math.random() * 150000) + 100000,
      employmentProvided: Math.floor(Math.random() * 18000) + 12000,
      completedWorks: Math.floor(Math.random() * 500) + 200,
      ongoingWorks: Math.floor(Math.random() * 300) + 100
    });
  }

  return metrics;
};

const fetchAllDistrictsData = async () => {
  try {
    console.log('\n🚀 Starting MGNREGA data fetch...');
    console.log('================================================\n');

    const apiKey = process.env.MGNREGA_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      console.log('⚠️  No valid API key found. Using mock data...');
      return await saveMockData();
    }

    console.log('📡 Attempting to fetch from data.gov.in API...');
    
    try {
      const response = await axios.get('https://api.data.gov.in/resource/9e86379e-6a46-4f7f-b1e7-5d0f0a4e8c6d', {
        params: {
          'api-key': apiKey,
          format: 'json',
          limit: 1000
        },
        timeout: 30000
      });

      if (response.data && response.data.records && response.data.records.length > 0) {
        console.log(`✅ Fetched ${response.data.records.length} records from API`);
        return await saveApiData(response.data.records);
      }
    } catch (apiError) {
      console.error('❌ API fetch failed:', apiError.message);
    }

    console.log('⚠️  API fetch failed. Falling back to mock data...');
    return await saveMockData();

  } catch (error) {
    console.error('❌ Error in fetchAllDistrictsData:', error);
    throw error;
  }
};

const saveMockData = async () => {
  try {
    console.log('💾 Saving mock data to database...');
    
    let savedCount = 0;

    for (const mockDistrict of MOCK_DISTRICTS) {
      const districtData = {
        districtId: `${mockDistrict.stateCode}${mockDistrict.districtCode}`,
        name: mockDistrict.name,
        state: mockDistrict.state,
        stateCode: mockDistrict.stateCode,
        districtCode: mockDistrict.districtCode,
        monthlyMetrics: generateMonthlyMetrics(),
        totalJobCards: Math.floor(Math.random() * 50000) + 20000,
        activeWorkers: Math.floor(Math.random() * 30000) + 10000,
        lastUpdated: new Date(),
        dataSource: 'MOCK'
      };

      await District.findOneAndUpdate(
        { districtId: districtData.districtId },
        districtData,
        { upsert: true, new: true }
      );

      savedCount++;
    }

    console.log(`✅ Saved ${savedCount} mock districts to database`);
    return savedCount;

  } catch (error) {
    console.error('❌ Error saving mock data:', error);
    throw error;
  }
};

const saveApiData = async (records) => {
  try {
    console.log('💾 Saving API data to database...');
    
    let savedCount = 0;

    for (const record of records) {
      const districtData = {
        districtId: record.district_code || `${record.state_code}${record.district_code}`,
        name: record.district_name,
        state: record.state_name,
        stateCode: record.state_code,
        districtCode: record.district_code,
        monthlyMetrics: [{
          month: record.month || 'October',
          year: parseInt(record.year) || 2024,
          jobsGenerated: parseInt(record.jobs_generated) || 0,
          wagesPaid: parseFloat(record.wages_paid) || 0,
          workdays: parseInt(record.workdays) || 0,
          employmentProvided: parseInt(record.employment_provided) || 0
        }],
        lastUpdated: new Date(),
        dataSource: 'API'
      };

      await District.findOneAndUpdate(
        { districtId: districtData.districtId },
        districtData,
        { upsert: true, new: true }
      );

      savedCount++;
    }

    console.log(`✅ Saved ${savedCount} districts from API`);
    return savedCount;

  } catch (error) {
    console.error('❌ Error saving API data:', error);
    throw error;
  }
};

module.exports = {
  fetchAllDistrictsData
};
