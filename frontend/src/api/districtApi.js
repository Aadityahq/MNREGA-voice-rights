import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getStates = async () => {
  try {
    const response = await apiClient.get('/states');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

export const getDistrictsByState = async (stateName) => {
  try {
    const response = await apiClient.get(`/states/${encodeURIComponent(stateName)}/districts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const getDistrictById = async (districtId) => {
  try {
    const response = await apiClient.get(`/districts/${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching district data:', error);
    throw error;
  }
};

export const getAudioSummary = async (districtId) => {
  try {
    const response = await apiClient.get(`/districts/${districtId}/audio-summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audio summary:', error);
    throw error;
  }
};

export default {
  getStates,
  getDistrictsByState,
  getDistrictById,
  getAudioSummary
};