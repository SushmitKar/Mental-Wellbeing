"use client";
import { useState } from "react";

export default function UploadMood() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict_mood", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload and analyze image");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold">Upload Image to Predict Mood</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2 border rounded-md"
      />
      <button
        onClick={uploadImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Upload & Predict
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-bold">Mood Prediction Result</h3>
          <p>Mood: {result.mood}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}