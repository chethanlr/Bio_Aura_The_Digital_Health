import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const WebcamFeed = ({ onCapture, isActive }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current && isActive) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture, isActive]);

  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      capture();
    }, 2000);

    return () => clearInterval(interval);
  }, [capture, isActive]);

  return (
    <div className="webcam-container relative">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user"
        }}
        className="rounded-lg"
      />
      {!isActive && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <p className="text-white text-lg">Click "Start Analysis" to begin</p>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed;
