import axios from 'axios';

const API_BASE_URL = '/api';

export const analyzeEmotion = async (imageData, audioData = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      image: imageData,
      audio: audioData
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

export const fuseEmotions = async (faceEmotion, voiceEmotion = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fuse`, {
      face_emotion: faceEmotion,
      voice_emotion: voiceEmotion
    });
    return response.data;
  } catch (error) {
    console.error('Error fusing emotions:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};
