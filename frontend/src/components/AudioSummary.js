import React, { useState } from 'react';
import { getAudioSummary } from '../api/districtApi';

const AudioSummary = ({ districtId }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const speakSummary = async () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    setLoading(true);
    
    try {
      const response = await getAudioSummary(districtId);
      
      if (response.success && response.summary) {
        const utterance = new SpeechSynthesisUtterance(response.summary);
        utterance.lang = 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          setPlaying(true);
          setLoading(false);
        };

        utterance.onend = () => {
          setPlaying(false);
        };

        utterance.onerror = () => {
          setPlaying(false);
          setLoading(false);
          alert('Error playing audio. Please try again.');
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error getting audio summary:', error);
      setLoading(false);
      alert('Could not load audio summary. Please try again.');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={speakSummary}
        disabled={loading}
        className="btn-audio mx-auto"
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            <span>Loading...</span>
          </>
        ) : playing ? (
          <>
            <span className="text-4xl">⏸️</span>
            <span>Stop Audio / आवाज़ बंद करें</span>
          </>
        ) : (
          <>
            <span className="text-4xl">🔊</span>
            <span>Listen to Summary / सुनें</span>
          </>
        )}
      </button>
      
      <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
        Click the button above to hear a summary of MGNREGA data in your district
      </p>
    </div>
  );
};

export default AudioSummary;