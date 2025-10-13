import numpy as np
from typing import Dict, Any
import cv2

class EmotionFusion:
    def __init__(self):
        self.stress_emotions = {
            'angry': 0.9,
            'fear': 0.85,
            'sad': 0.7,
            'disgust': 0.75,
            'neutral': 0.3,
            'happy': 0.1,
            'surprise': 0.5
        }
        
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        try:
            from deepface import DeepFace
            self.model = DeepFace
            print("✅ DeepFace model loaded successfully")
        except Exception as e:
            print(f"⚠️ DeepFace initialization warning: {e}")
            self.model = None
    
    def analyze_face(self, image) -> Dict[str, Any]:
        try:
            if self.model is None:
                return self._get_default_emotion()
            
            analysis = self.model.analyze(
                image,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            if isinstance(analysis, list):
                analysis = analysis[0]
            
            emotions = analysis.get('emotion', {})
            
            dominant_emotion = max(emotions.items(), key=lambda x: x[1])
            
            return {
                "emotion": dominant_emotion[0],
                "confidence": dominant_emotion[1] / 100.0,
                "all_emotions": {k: v / 100.0 for k, v in emotions.items()}
            }
        
        except Exception as e:
            print(f"Face analysis error: {e}")
            return self._get_default_emotion()
    
    def _get_default_emotion(self) -> Dict[str, Any]:
        return {
            "emotion": "neutral",
            "confidence": 0.5,
            "all_emotions": {
                "neutral": 0.5,
                "happy": 0.2,
                "sad": 0.1,
                "angry": 0.1,
                "fear": 0.05,
                "surprise": 0.05
            }
        }
    
    def calculate_stress(self, face_data: Dict, voice_data: Dict) -> Dict[str, Any]:
        face_emotion = face_data.get('emotion', 'neutral')
        face_confidence = face_data.get('confidence', 0.5)
        
        face_stress = self.stress_emotions.get(face_emotion, 0.5)
        
        voice_emotion = voice_data.get('emotion', 'neutral')
        voice_energy = voice_data.get('energy', 0.5)
        
        voice_stress = voice_energy * 0.5
        
        stress_index = (face_stress * 0.7 + voice_stress * 0.3) * face_confidence
        stress_index = max(0.0, min(1.0, stress_index))
        
        if stress_index < 0.3:
            state = "calm"
            emoji = "😌"
            color = "#3CE38C"
        elif stress_index < 0.6:
            state = "mild"
            emoji = "😐"
            color = "#FFD166"
        else:
            state = "high"
            emoji = "😫"
            color = "#EF476F"
        
        return {
            "stress_index": round(stress_index, 3),
            "state": state,
            "emoji": emoji,
            "color": color,
            "face_emotion": face_emotion,
            "face_confidence": round(face_confidence, 3)
        }
