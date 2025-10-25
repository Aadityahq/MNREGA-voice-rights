const express = require('express');
const router = express.Router();
const {
  getStates,
  getDistrictById,
  getAudioSummary,
  getDistrictsByState
} = require('../controllers/districtController');

// Get all states
router.get('/states', getStates);

// Get districts by state
router.get('/states/:stateName/districts', getDistrictsByState);

// Get district by ID
router.get('/districts/:id', getDistrictById);

// Get audio summary for district
router.get('/districts/:id/audio-summary', getAudioSummary);

module.exports = router;