# Overview

BioAura is an AI-powered emotion and stress tracking application that uses computer vision and audio analysis to monitor emotional well-being in real-time. The application analyzes facial expressions using DeepFace AI and voice tone using Librosa audio processing, combining both modalities into a unified stress index (0-1 scale). It provides instant feedback through a dynamic, color-coded dashboard. The system captures video from a webcam and optionally microphone audio, processes facial micro-expressions and voice features, and displays results with a health-tech aesthetic featuring glowing aura borders that change based on stress levels (calm/green, mild stress/amber, high stress/red).

**Status**: ✅ Fully functional multimodal emotion and stress tracker (October 2025)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React.js with Vite build tool
- **Rationale**: Vite provides fast development server with hot module replacement, optimized for React applications
- **Styling**: TailwindCSS utility-first framework for rapid UI development with custom color palette
- **Visualization**: Chart.js with React wrapper for historical emotion timeline display
- **Camera Access**: React-Webcam library for real-time video capture

**Design System**:
- Custom color scheme mapping stress levels (calm: #3CE38C, mild: #FFD166, high: #EF476F)
- Poppins typography for modern health-tech aesthetic
- CSS animations with glow effects for visual feedback
- Dark theme background (#1E1E2F)

**Communication**: Axios HTTP client with proxy configuration routing `/api` requests to backend port 8000

## Backend Architecture

**Framework**: FastAPI Python web framework
- **Rationale**: High performance async support, automatic API documentation, simple request validation
- **CORS**: Configured to allow all origins for development flexibility

**AI/ML Pipeline**:
- **Facial Emotion Recognition**: DeepFace library (v0.0.79) with OpenCV backend for face detection
- **Audio Analysis**: Librosa for audio feature extraction (energy, zero-crossing rate, spectral centroid)
- **Emotion Fusion**: Custom EmotionFusion class mapping emotions to stress weights (angry: 0.9, happy: 0.1, etc.)

**Processing Flow**:
1. Base64 image decoding from frontend
2. NumPy array conversion and OpenCV processing
3. DeepFace emotion analysis with 7 emotion categories
4. Optional audio analysis for multimodal emotion detection
5. Stress index calculation and state classification

**ML Dependencies**: TensorFlow/Keras (v2.15.0) for DeepFace model backend, OpenCV for image preprocessing

## Multi-Service Architecture

**Service Separation**:
- Frontend server: Port 5000 (Vite dev server)
- Backend API: Port 8000 (FastAPI with Uvicorn)
- **Proxy Configuration**: Vite reverse proxy forwards `/api/*` requests to backend, avoiding CORS issues

**Data Flow**:
- Real-time webcam frames captured in browser
- Base64-encoded images sent to `/analyze` endpoint
- Processed emotion data returned with confidence scores
- Historical data visualization in frontend

# External Dependencies

## AI/ML Libraries
- **DeepFace** (v0.0.79): Pre-trained facial emotion recognition models
- **TensorFlow** (v2.15.0): Deep learning framework powering DeepFace
- **tf-keras** (v2.15.0): Keras API for TensorFlow
- **OpenCV** (opencv-python-headless v4.8.1.78): Computer vision and image processing
- **Librosa** (v0.11.0): Audio analysis and feature extraction
- **SoundFile** (v0.13.1): Audio file I/O

## Web Framework & API
- **FastAPI** (v0.104.1): Backend REST API framework
- **Uvicorn** (v0.24.0): ASGI server for FastAPI
- **React** (v18.2.0): Frontend UI library
- **Vite** (v5.0.8): Frontend build tool and dev server

## Data Visualization & UI
- **Chart.js** (v4.4.1): JavaScript charting library
- **TailwindCSS** (v3.4.0): Utility-first CSS framework
- **React-Webcam** (v7.2.0): Webcam integration component

## Data Processing
- **NumPy** (<v2): Numerical computing for image arrays
- **Pillow** (v10.1.0): Python image processing
- **SciPy** (v1.16.2): Scientific computing utilities

## HTTP Communication
- **Axios** (v1.6.2): Promise-based HTTP client for API requests
- **CORS Middleware**: Configured in FastAPI for cross-origin requests