import api from './api';

async function testAPI() {
  try {
    console.log('🧪 Testing API connection...');
    
    const states = await api.getStates();
    console.log('✅ States fetch:', states.success, 'Count:', states.count);
    
    const districts = await api.getAllDistricts({ limit: 5 });
    console.log('✅ Districts fetch:', districts.success, 'Count:', districts.data?.length);
    
    if (states.count > 0 && states.data[0]) {
      const stateName = states.data[0].name;
      const stateDistricts = await api.getDistrictsByState(stateName);
      console.log('✅ State districts:', stateDistricts.success, 'Count:', stateDistricts.count);
      
      if (stateDistricts.count > 0) {
        const districtId = stateDistricts.data[0].districtId;
        const district = await api.getDistrictById(districtId);
        console.log('✅ District detail:', district.success, 'Name:', district.data?.name);
      }
    }
    
    console.log('✅ All API tests passed!');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testAPI();
