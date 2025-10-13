import React, { useState, useEffect, useRef } from 'react';
import WebcamFeed from './components/WebcamFeed';
import Dashboard from './components/Dashboard';
import { analyzeEmotion, fuseEmotions, checkHealth } from './api';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stressData, setStressData] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAnalyzing && audioEnabled) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
    return () => stopAudioCapture();
  }, [isAnalyzing, audioEnabled]);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current = [event.data];
        }
      };
      
      mediaRecorder.start(2000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setAudioEnabled(false);
    }
  };

  const stopAudioCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    audioChunksRef.current = [];
  };

  const getAudioBlob = () => {
    if (audioChunksRef.current.length === 0) return null;
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    return audioBlob;
  };

  const convertBlobToWav = async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const wavBuffer = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      await audioContext.close();
      return wavBlob;
    } catch (error) {
      console.error('Error converting to WAV:', error);
      return null;
    }
  };

  const audioBufferToWav = (buffer) => {
    const numChannels = 1;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    
    const channelData = buffer.getChannelData(0);
    const length = channelData.length;
    const result = new Int16Array(length);
    
    for (let i = 0; i < length; i++) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const dataLength = result.length * 2;
    const buffer_size = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(buffer_size);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * bitDepth / 8, true);
    view.setUint16(32, numChannels * bitDepth / 8, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);
    
    const offset = 44;
    for (let i = 0; i < result.length; i++) {
      view.setInt16(offset + i * 2, result[i], true);
    }
    
    return arrayBuffer;
  };

  const handleImageCapture = async (imageSrc) => {
    if (!isAnalyzing) return;

    try {
      let audioData = null;
      if (audioEnabled) {
        const audioBlob = getAudioBlob();
        if (audioBlob && audioBlob.size > 0) {
          const wavBlob = await convertBlobToWav(audioBlob);
          if (wavBlob) {
            audioData = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(wavBlob);
            });
          }
        }
      }
      
      const analysisResult = await analyzeEmotion(imageSrc, audioData);
      
      const fusedResult = await fuseEmotions(
        analysisResult.face,
        analysisResult.voice
      );

      setStressData(fusedResult);
      
      setEmotionHistory(prev => {
        const newHistory = [...prev, fusedResult];
        return newHistory.slice(-30);
      });

    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
    if (!isAnalyzing) {
      setEmotionHistory([]);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="min-h-screen bg-dark text-white font-poppins">
      <header className="bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🌈</span>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-calm via-mild to-high bg-clip-text text-transparent">
                  BioAura
                </h1>
                <p className="text-sm text-gray-400">Feel Your Flow</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  apiStatus === 'connected' ? 'bg-calm' : 
                  apiStatus === 'disconnected' ? 'bg-high' : 
                  'bg-mild'
                } pulse-animation`} />
                <span className="text-sm text-gray-400">
                  {apiStatus === 'connected' ? 'Connected' : 
                   apiStatus === 'disconnected' ? 'Disconnected' : 
                   'Checking...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Live Feed</h2>
                <div className="flex gap-3">
                  <button
                    onClick={toggleAudio}
                    disabled={isAnalyzing}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      audioEnabled
                        ? 'bg-mild hover:bg-yellow-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isAnalyzing ? 'Stop analysis to toggle audio' : 'Toggle microphone'}
                  >
                    🎤 {audioEnabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={toggleAnalysis}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isAnalyzing
                        ? 'bg-high hover:bg-red-600'
                        : 'bg-calm hover:bg-green-600'
                    }`}
                  >
                    {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
                  </button>
                </div>
              </div>
              
              <WebcamFeed 
                onCapture={handleImageCapture} 
                isActive={isAnalyzing}
              />
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">About BioAura</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                BioAura is a contactless wellness tracker that analyzes your emotional 
                state through facial expressions and voice tone (when microphone is enabled). 
                It provides real-time feedback on your stress levels, helping you maintain 
                awareness of your emotional well-being.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-calm">●</span>
                  <span className="text-gray-400">Calm: Stress Index &lt; 30%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-mild">●</span>
                  <span className="text-gray-400">Mild Stress: 30% - 60%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-high">●</span>
                  <span className="text-gray-400">High Stress: &gt; 60%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Dashboard 
              stressData={stressData} 
              emotionHistory={emotionHistory}
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built for emotional wellness and self-awareness 💚
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
