const mongoose = require('mongoose');
const { fetchAllDistrictsData } = require('../utils/fetchMGNREGA');
require('dotenv').config();

async function fetchRealMGNREGAData() {
  try {
    console.log('🚀 Starting real MGNREGA data fetch...');
    console.log('📅 Current Date:', new Date().toISOString());
    console.log('================================================\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📡 Fetching data from MGNREGA API...');
    console.log('This may take several minutes...\n');

    const count = await fetchAllDistrictsData();

    console.log('\n================================================');
    console.log(`✅ Successfully fetched data for ${count} districts`);
    console.log('================================================\n');

    const District = mongoose.model('District');
    const totalDistricts = await District.countDocuments();
    const states = await District.distinct('state');

    console.log('📊 Database Statistics:');
    console.log(`   Total Districts: ${totalDistricts}`);
    console.log(`   Total States: ${states.length}`);
    console.log(`   States: ${states.sort().join(', ')}`);

    const sample = await District.findOne().lean();
    if (sample) {
      console.log('\n📋 Sample District Data:');
      console.log(`   Name: ${sample.name}`);
      console.log(`   State: ${sample.state}`);
      console.log(`   Metrics: ${sample.monthlyMetrics?.length || 0} months`);
      console.log(`   Last Updated: ${sample.lastUpdated}`);
      console.log(`   Data Source: ${sample.dataSource}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('🎉 Data fetch completed successfully!');
    
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

fetchRealMGNREGAData();
