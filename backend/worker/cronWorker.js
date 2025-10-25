require('dotenv').config();
const cron = require('node-cron');
const connectDB = require('../config/db');
const { fetchAndStoreData } = require('../utils/fetchMGNREGA');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
connectDB();

/**
 * Cron job to fetch and update MGNREGA data
 * Runs every 4 hours
 */
const updateMGNREGAData = cron.schedule('0 */4 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Starting MGNREGA data update...`);
  
  try {
    // Fetch and store latest data
    const districts = await fetchAndStoreData();
    
    console.log(`Successfully updated ${districts.length} districts`);
    
    // Generate JSON snapshot for offline fallback
    const snapshotDir = path.join(__dirname, '../snapshots');
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }
    
    const snapshotPath = path.join(snapshotDir, `snapshot_${Date.now()}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(districts, null, 2));
    
    console.log(`Snapshot saved to ${snapshotPath}`);
    
    // Clean up old snapshots (keep only last 5)
    const files = fs.readdirSync(snapshotDir)
      .filter(file => file.startsWith('snapshot_'))
      .sort()
      .reverse();
    
    if (files.length > 5) {
      files.slice(5).forEach(file => {
        fs.unlinkSync(path.join(snapshotDir, file));
        console.log(`Deleted old snapshot: ${file}`);
      });
    }
    
    console.log(`[${new Date().toISOString()}] MGNREGA data update completed`);
  } catch (error) {
    console.error('Error updating MGNREGA data:', error);
  }
});

// Manual update function for testing
const runManualUpdate = async () => {
  console.log('Running manual data update...');
  try {
    const districts = await fetchAndStoreData();
    console.log(`Manually updated ${districts.length} districts`);
    process.exit(0);
  } catch (error) {
    console.error('Error in manual update:', error);
    process.exit(1);
  }
};

// Check if running in manual mode
if (process.argv.includes('--manual')) {
  runManualUpdate();
} else {
  console.log('MGNREGA Cron Worker started');
  console.log('Schedule: Every 4 hours');
  updateMGNREGAData.start();
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping cron worker...');
  updateMGNREGAData.stop();
  process.exit(0);
});