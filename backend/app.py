from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
import base64
from typing import Optional
from emotion_fusion import EmotionFusion
from audio_analyzer import AudioAnalyzer
import io
from PIL import Image

app = FastAPI(title="BioAura API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

emotion_fusion = EmotionFusion()
audio_analyzer = AudioAnalyzer()

class ImageData(BaseModel):
    image: str

class AudioData(BaseModel):
    audio: str

class MultimodalData(BaseModel):
    image: str
    audio: Optional[str] = None

class FusionRequest(BaseModel):
    face_emotion: dict
    voice_emotion: Optional[dict] = None

@app.get("/")
def read_root():
    return {"message": "🌈 BioAura API - Feel Your Flow", "status": "active"}

@app.post("/analyze")
async def analyze_emotion(data: MultimodalData):
    try:
        img_data = base64.b64decode(data.image.split(',')[1])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        face_result = emotion_fusion.analyze_face(img)
        
        if data.audio and data.audio != "":
            try:
                audio_data = base64.b64decode(data.audio.split(',')[1] if ',' in data.audio else data.audio)
                voice_result = audio_analyzer.analyze_audio(audio_data)
            except Exception as e:
                print(f"Audio processing error: {e}")
                voice_result = {
                    "emotion": "neutral",
                    "confidence": 0.5,
                    "energy": 0.5
                }
        else:
            voice_result = {
                "emotion": "neutral",
                "confidence": 0.5,
                "energy": 0.5
            }
        
        return {
            "face": face_result,
            "voice": voice_result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/analyze-audio")
async def analyze_audio_only(data: AudioData):
    try:
        audio_bytes = base64.b64decode(data.audio.split(',')[1] if ',' in data.audio else data.audio)
        result = audio_analyzer.analyze_audio(audio_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis error: {str(e)}")

@app.post("/fuse")
async def fuse_emotions(request: FusionRequest):
    try:
        stress_data = emotion_fusion.calculate_stress(
            request.face_emotion,
            request.voice_emotion or {}
        )
        
        return stress_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fusion error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "BioAura"}
