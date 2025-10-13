import numpy as np
import librosa
import soundfile as sf
from io import BytesIO
from typing import Dict, Any

class AudioAnalyzer:
    def __init__(self):
        self.sr = 22050
        
    def analyze_audio(self, audio_bytes: bytes) -> Dict[str, Any]:
        try:
            audio_data, sr = sf.read(BytesIO(audio_bytes))
            
            if audio_data is None or len(audio_data) == 0:
                raise ValueError("No audio data could be extracted")
            
            if len(audio_data.shape) > 1:
                audio_data = np.mean(audio_data, axis=1)
            
            if sr != self.sr:
                audio_data = librosa.resample(audio_data, orig_sr=sr, target_sr=self.sr)
            
            energy = np.mean(librosa.feature.rms(y=audio_data)[0])
            
            zcr = np.mean(librosa.feature.zero_crossing_rate(audio_data)[0])
            
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio_data, sr=self.sr)[0])
            
            energy_normalized = min(energy * 50, 1.0)
            pitch_normalized = min(spectral_centroid / 2000, 1.0)
            
            stress_indicator = (energy_normalized * 0.6 + zcr * 0.4)
            
            if stress_indicator > 0.7:
                emotion = "stressed"
                confidence = stress_indicator
            elif stress_indicator > 0.5:
                emotion = "anxious"
                confidence = stress_indicator * 0.9
            elif stress_indicator < 0.3:
                emotion = "calm"
                confidence = 1.0 - stress_indicator
            else:
                emotion = "neutral"
                confidence = 0.6
            
            return {
                "emotion": emotion,
                "confidence": float(confidence),
                "energy": float(energy_normalized),
                "pitch": float(pitch_normalized),
                "stress_level": float(stress_indicator)
            }
        
        except Exception as e:
            print(f"Audio analysis error: {e}")
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "energy": 0.5,
                "pitch": 0.5,
                "stress_level": 0.5
            }
