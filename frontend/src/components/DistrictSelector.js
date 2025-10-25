import React, { useState, useEffect } from 'react';
import { getStates, getDistrictsByState } from '../api/districtApi';

const DistrictSelector = ({ onDistrictSelect }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const mockDistricts = [
    { districtId: 101, name: 'Allahabad', state: 'Uttar Pradesh' },
    { districtId: 102, name: 'Varanasi', state: 'Uttar Pradesh' },
    { districtId: 103, name: 'Lucknow', state: 'Uttar Pradesh' },
    { districtId: 201, name: 'Patna', state: 'Bihar' },
    { districtId: 202, name: 'Gaya', state: 'Bihar' }
  ];

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await getStates();
      if (response.success && response.data.length > 0) {
        setStates(response.data);
      } else {
        setStates([
          { id: 1, name: 'Uttar Pradesh' },
          { id: 2, name: 'Bihar' },
          { id: 3, name: 'Maharashtra' },
          { id: 4, name: 'Rajasthan' },
          { id: 5, name: 'Madhya Pradesh' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([
        { id: 1, name: 'Uttar Pradesh' },
        { id: 2, name: 'Bihar' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = async (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setLoading(true);

    try {
      const response = await getDistrictsByState(stateName);
      if (response.success && response.data.length > 0) {
        setDistricts(response.data);
      } else {
        const filtered = mockDistricts.filter(d => d.state === stateName);
        setDistricts(filtered);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      const filtered = mockDistricts.filter(d => d.state === stateName);
      setDistricts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district.name);
    onDistrictSelect(district.districtId);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-5xl">🗺️</span>
          <h2 className="text-3xl font-bold text-gray-800">राज्य चुनें / Select State</h2>
        </div>
        
        {loading && !selectedState ? (
          <div className="flex justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {states.map((state) => (
              <div
                key={state.id}
                onClick={() => handleStateSelect(state.name)}
                className={`selection-card ${selectedState === state.name ? 'selected' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">📍</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{state.name}</h3>
                    <p className="text-sm text-gray-600">Click to select</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedState && (
        <div className="animate-fadeIn">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-5xl">🏘️</span>
            <h2 className="text-3xl font-bold text-gray-800">जिला चुनें / Select District</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : districts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.map((district) => (
                <div
                  key={district.districtId}
                  onClick={() => handleDistrictSelect(district)}
                  className={`selection-card ${selectedDistrict === district.name ? 'selected' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">🏛️</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{district.name}</h3>
                      <p className="text-sm text-blue-600">View Dashboard →</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl">📭</span>
              <p className="text-xl text-gray-600 mt-4">No districts found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DistrictSelector;