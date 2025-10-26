const cron = require('node-cron');
const { fetchAllDistrictsData } = require('../utils/fetchMGNREGA');

const startCronJobs = () => {
  const cronEnabled = process.env.CRON_ENABLED === 'true';
  const cronSchedule = process.env.CRON_SCHEDULE || '0 */4 * * *';

  if (!cronEnabled) {
    console.log('⚠️  Cron jobs are disabled');
    return;
  }

  console.log('⏰ Starting cron worker...');
  console.log(`📅 Schedule: ${cronSchedule} (every 4 hours)`);

  cron.schedule(cronSchedule, async () => {
    console.log('\n🔄 Cron job started:', new Date().toISOString());
    
    try {
      await fetchAllDistrictsData();
      console.log('✅ Cron job completed successfully\n');
    } catch (error) {
      console.error('❌ Cron job failed:', error);
    }
  });

  console.log('✅ Cron worker started successfully');
};

module.exports = { startCronJobs };
