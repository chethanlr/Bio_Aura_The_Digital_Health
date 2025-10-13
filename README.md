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

1. Webcam captures your facial expressions every 2 seconds
2. DeepFace AI analyzes emotions (happy, sad, angry, fear, surprise, neutral, disgust)
3. Emotions are mapped to stress levels
4. Real-time visualization with glowing borders and stress bar
5. Historical chart tracks your emotional journey

## 🎯 Built For

Hackathons, digital well-being initiatives, and emotional self-awareness projects.

---

**Feel Your Flow** 💚
