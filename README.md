# 🌈 BioAura — AI-Powered Emotion & Stress Tracker

BioAura is a real-time emotion and stress tracking application that uses computer vision to analyze facial expressions and provide instant feedback on emotional well-being.

## 🩺 Concept

A contactless wellness tracker that senses a person's emotional state through facial micro-expressions, giving instant feedback on stress and mood levels without needing wearables.

## ✨ Features

- **Real-time Facial Emotion Detection** using DeepFace AI
- **Stress Index Calculation** (0-1 scale) with three states:
  - 😌 **Calm** (Index < 0.3)
  - 😐 **Mild Stress** (Index < 0.6)
  - 😫 **High Stress** (Index ≥ 0.6)
- **Dynamic Glowing Dashboard** with color-coded aura borders
- **Historical Emotion Timeline** showing stress patterns
- **Beautiful Health-tech UI** with smooth animations

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Chart.js for visualizations
- React-Webcam for camera access

### Backend
- FastAPI (Python)
- DeepFace for emotion recognition
- OpenCV for image processing
- TensorFlow/Keras for ML models

## 🚀 Getting Started

The application runs on two services:
- **Backend API**: Port 8000
- **Frontend**: Port 5000

Both services are configured to run automatically when you start the Repl.

## 🎨 Design

- **Color Palette**:
  - Calm → #3CE38C (Green)
  - Mild Stress → #FFD166 (Amber)
  - High Stress → #EF476F (Red)
  - Background → #1E1E2F
- **Typography**: Poppins
- **Theme**: Minimal, glowing, health-tech aesthetic

## 📊 How It Works

1. **Webcam** captures your facial expressions every 2 seconds
2. **Microphone** (optional) captures voice tone for enhanced analysis
3. **DeepFace AI** analyzes facial emotions (happy, sad, angry, fear, surprise, neutral, disgust)
4. **Librosa** processes voice features (energy, pitch, stress indicators)
5. **Fusion Algorithm** combines both modalities into unified stress index
6. Real-time visualization with glowing borders and stress bar
7. Historical chart tracks your emotional journey over the session

## 🌐 Browser Support

- **Recommended**: Chrome, Edge, or any Chromium-based browser
- **Required Permissions**: 
  - Camera access for facial emotion detection
  - Microphone access for voice analysis (optional, can be toggled)
- **Web Audio API** support required for audio processing

## 🔬 Technical Details

### Audio Processing
- MediaRecorder API captures microphone input in 2-second chunks
- Web Audio API converts WebM to WAV format on the frontend
- Librosa extracts audio features (RMS energy, zero-crossing rate, spectral centroid)
- Voice stress indicators are calculated from audio energy and pitch

### Emotion Fusion
- Facial emotion → stress weight mapping (angry: 0.9, happy: 0.1, etc.)
- Voice features → stress level calculation (0-1 scale)
- Combined stress index = 70% facial + 30% voice (when enabled)
- Three states: Calm (<0.3), Mild (0.3-0.6), High (>0.6)

## 🎯 Built For

Hackathons, digital well-being initiatives, and emotional self-awareness projects.

---

**Feel Your Flow** 💚
