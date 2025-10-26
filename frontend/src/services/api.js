import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  getStates: async () => {
    try {
      const response = await apiClient.get('/states');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch states');
    }
  },

  getDistrictsByState: async (stateName, params = {}) => {
    try {
      const response = await apiClient.get(`/states/${encodeURIComponent(stateName)}/districts`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch districts');
    }
  },

  getAllDistricts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/districts', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch districts');
    }
  },

  getDistrictById: async (districtId) => {
    try {
      const response = await apiClient.get(`/districts/${districtId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch district data');
    }
  },

  getStatistics: async () => {
    try {
      const response = await apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  getAudioSummary: async (districtId) => {
    try {
      const response = await apiClient.get(`/districts/${districtId}/audio-summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audio summary');
    }
  },

  triggerDataFetch: async () => {
    try {
      const response = await apiClient.post('/fetch-data');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger data fetch');
    }
  },
};

export default api;
