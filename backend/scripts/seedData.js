const mongoose = require('mongoose');
const { fetchAllDistrictsData } = require('../utils/fetchMGNREGA');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    console.log('📅 Current Date:', new Date().toISOString());
    console.log('================================================\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const District = mongoose.model('District');
    
    const existingCount = await District.countDocuments();
    console.log(`📊 Existing districts in database: ${existingCount}\n`);

    if (existingCount > 0) {
      console.log('⚠️  Database already has data.');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      await new Promise((resolve) => {
        readline.question('Do you want to clear and reseed? (yes/no): ', (answer) => {
          readline.close();
          if (answer.toLowerCase() === 'yes') {
            District.deleteMany({}).then(() => {
              console.log('🗑️  Cleared existing data\n');
              resolve();
            });
          } else {
            console.log('Keeping existing data...\n');
            resolve();
          }
        });
      });
    }

    console.log('📡 Fetching MGNREGA data...\n');
    const count = await fetchAllDistrictsData();

    console.log('\n================================================');
    console.log(`✅ Successfully seeded ${count} districts`);
    console.log('================================================\n');

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
      console.log(`   Data Source: ${sample.dataSource}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Database seed completed!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
