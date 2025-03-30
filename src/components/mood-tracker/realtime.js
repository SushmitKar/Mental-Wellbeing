'use client'

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  // Explicitly set ref type to Webcam
  const webcamRef = useRef(null);
  const [mood, setMood] = useState("");

  // Capture Frame with Null Check
  const captureFrame = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.getScreenshot) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const response = await fetch("/api/predict_mood", {
          method: "POST",
          body: JSON.stringify({ image: imageSrc }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setMood(data.mood);
      }
    } else {
      console.warn("Webcam not ready or screenshot failed.");
    }
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
      />
      <button onClick={captureFrame}>Capture Mood</button>
      {mood && <h3>Detected Mood: {mood}</h3>}
    </div>
  );
};

export default WebcamCapture;