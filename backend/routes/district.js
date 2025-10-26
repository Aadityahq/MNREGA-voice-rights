const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

router.get('/states', districtController.getStates);
router.get('/states/:stateName/districts', districtController.getDistrictsByState);
router.get('/districts', districtController.getAllDistricts);
router.get('/districts/:id', districtController.getDistrictById);
router.get('/statistics', districtController.getStatistics);
router.get('/districts/:id/audio-summary', districtController.getAudioSummary);
router.post('/fetch-data', districtController.fetchData);

module.exports = router;