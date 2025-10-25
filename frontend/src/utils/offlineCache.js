const CACHE_PREFIX = 'mgnrega_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

export const saveToCache = (key, data) => {
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Error saving to cache:', error);
    return false;
  }
};

export const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    
    if (!cached) {
      return null;
    }
    
    const cacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheData.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
};

export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

export const isCacheValid = (key) => {
  const data = getFromCache(key);
  return data !== null;
};

export default {
  saveToCache,
  getFromCache,
  clearCache,
  isCacheValid
};