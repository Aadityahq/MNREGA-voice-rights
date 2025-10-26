const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

// Get all states with statistics
router.get('/states', districtController.getStates);

// Get districts by state with filters
router.get('/states/:stateName/districts', districtController.getDistrictsByState);

// Get all districts with advanced filtering
router.get('/districts', districtController.getAllDistricts);

// Get district by ID
router.get('/districts/:id', districtController.getDistrictById);

// Get overall statistics
router.get('/statistics', districtController.getStatistics);

// Get audio summary for district
router.get('/districts/:id/audio-summary', districtController.getAudioSummary);

// Manual trigger to fetch data
router.post('/fetch-data', districtController.fetchData);

module.exports = router;
