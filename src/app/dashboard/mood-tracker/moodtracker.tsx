// "use client";

// import { useEffect, useRef, useState } from "react";
// import MoodTrendChart from "./MoodTrendChart";
// import MoodHistory from "@/components/mood-tracker/MoodHistory";

// export default function MoodTracker() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [mood, setMood] = useState<string>(""); // Detected mood
//   const [confidence, setConfidence] = useState<number | null>(null); // Confidence %
//   const [error, setError] = useState<string>(""); // Error handling
//   const [stream, setStream] = useState<MediaStream | null>(null); // Webcam stream
//   const [isStreaming, setIsStreaming] = useState<boolean>(false); // Streaming status

//   // 🎥 Start Webcam and Periodic Frame Capture
//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = newStream;
//           setStream(newStream);
//           setIsStreaming(true);
//         }
//         startFrameCapture(); // Start sending frames after video loads
//       } catch (err) {
//         console.error("Error accessing webcam:", err);
//         setError("Error accessing webcam. Please allow camera permissions.");
//       }
//     };

//     startVideo();

//     // Cleanup on unmount
//     return () => {
//       stopVideoStream();
//     };
//   }, []);

//   // 📸 Capture & Send Frames Periodically to Backend
//   const startFrameCapture = () => {
//     const intervalId = setInterval(() => {
//       captureFrame();
//     }, 2000); // Send frame every 2 seconds (adjust as needed)

//     return () => clearInterval(intervalId); // Stop frame capture on unmount
//   };

//   // 🚫 Stop Webcam Stream
//   const stopVideoStream = () => {
//     if (stream) {
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setStream(null);
//       setIsStreaming(false);
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//     }
//   };

//   // 📸 Capture Single Frame and Send to Backend
//   const captureFrame = async () => {
//     if (!videoRef.current || !videoRef.current.srcObject) {
//       setError("Webcam not loaded. Please refresh and try again.");
//       return;
//     }

//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (!context) {
//       setError("Error capturing video frame.");
//       return;
//     }

//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         setError("Error capturing image.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");

//       try {
//         const token = localStorage.getItem("token");
//         // Send POST request to /webcam for real-time frame processing
//         const response = await fetch("http://127.0.0.1:8000/mood_detect", {
//           method: "POST",
//           body: formData,  // ✅ Correctly sends the image
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }

//         const data = await response.json();
//         setMood(data.mood);
//         setConfidence(data.confidence);
//       } catch (err) {
//         console.error("Error predicting mood:", err);
//         setError("Error predicting mood. Please try again.");
//       }
//     }, "image/jpeg");
//   };

//   // 🔄 Restart Webcam if Needed
//   const restartWebcam = async () => {
//     stopVideoStream();
//     try {
//       const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = newStream;
//         setStream(newStream);
//         setIsStreaming(true);
//         startFrameCapture(); // Resume capturing frames
//       }
//     } catch (err) {
//       console.error("Error restarting webcam:", err);
//       setError("Error restarting webcam.");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
//       <h2 className="text-xl font-bold text-gray-800">🎥 Real-Time Mood Tracker</h2>

//       <MoodTrendChart data={MoodHistory} />

//       {/* Webcam Video */}
//       <video
//         ref={videoRef}
//         autoPlay
//         className="w-full max-w-md rounded-md border shadow-sm"
//       />

//       {/* Stop Webcam Button */}
//       {isStreaming ? (
//         <button
//           onClick={stopVideoStream}
//           className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           ⏹️ Stop Webcam
//         </button>
//       ) : (
//         <button
//           onClick={restartWebcam}
//           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           🔄 Restart Webcam
//         </button>
//       )}

//       {/* Mood & Confidence Display */}
//       {mood && (
//         <p className="text-lg font-semibold text-gray-700">
//           Detected Mood: <span className="text-blue-600">{mood}</span>{" "}
//           {confidence !== null && (
//             <>
//               (Confidence:{" "}
//               <span className="text-green-500">{(confidence * 100).toFixed(2)}%</span>)
//             </>
//           )}
//         </p>
//       )}

//       {/* Error Display */}
//       {error && <p className="text-red-500 font-medium">{error}</p>}
//     </div>
//   );
// }





















// "use client";

// import { useEffect, useRef, useState } from "react";
// import MoodTrendChart from "./MoodTrendChart";
// import MoodHistory from "@/components/mood-tracker/MoodHistory";

// export default function MoodTracker() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [mood, setMood] = useState<string>("");
//   const [confidence, setConfidence] = useState<number | null>(null);
//   const [error, setError] = useState<string>("");
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [isStreaming, setIsStreaming] = useState<boolean>(false);
//   const [moodTrendData, setMoodTrendData] = useState([]);

//   // 🎥 Start Webcam
//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = newStream;
//           setStream(newStream);
//           setIsStreaming(true);
//         }
//         startFrameCapture();
//       } catch (err) {
//         console.error("Error accessing webcam:", err);
//         setError("Error accessing webcam. Please allow camera permissions.");
//       }
//     };

//     startVideo();
//     fetchMoodTrendData(); // Fetch mood trend for chart

//     return () => {
//       stopVideoStream();
//     };
//   }, []);

//   const fetchMoodTrendData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:8000/mood_history/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch mood trend data");
//       }

//       const data = await response.json();
//       const chartData = data.history.map((entry) => ({
//         date: new Date(entry.timestamp).toLocaleDateString(),
//         moodScore: moodToScore(entry.mood),
//       }));
//       setMoodTrendData(chartData);
//     } catch (err) {
//       console.error("Error fetching mood trend:", err);
//     }
//   };

//   const moodToScore = (mood: string): number => {
//     const moodMap: { [key: string]: number } = {
//       happy: 5,
//       excited: 4,
//       neutral: 3,
//       sad: 2,
//       angry: 1,
//       depressed: 0,
//     };
//     return moodMap[mood.toLowerCase()] || 3;
//   };

//   const startFrameCapture = () => {
//     const intervalId = setInterval(() => {
//       captureFrame();
//     }, 2000);
//     return () => clearInterval(intervalId);
//   };

//   const stopVideoStream = () => {
//     if (stream) {
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setStream(null);
//       setIsStreaming(false);
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//     }
//   };

//   const captureFrame = async () => {
//     if (!videoRef.current || !videoRef.current.srcObject) {
//       setError("Webcam not loaded. Please refresh and try again.");
//       return;
//     }

//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     if (!context) {
//       setError("Error capturing video frame.");
//       return;
//     }

//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         setError("Error capturing image.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");

//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://127.0.0.1:8000/mood_detect", {
//           method: "POST",
//           body: formData,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }

//         const data = await response.json();
//         setMood(data.mood);
//         setConfidence(data.confidence);
//       } catch (err) {
//         console.error("Error predicting mood:", err);
//         setError("Error predicting mood. Please try again.");
//       }
//     }, "image/jpeg");
//   };

//   const restartWebcam = async () => {
//     stopVideoStream();
//     try {
//       const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = newStream;
//         setStream(newStream);
//         setIsStreaming(true);
//         startFrameCapture();
//       }
//     } catch (err) {
//       console.error("Error restarting webcam:", err);
//       setError("Error restarting webcam.");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-6">
//       <h2 className="text-xl font-bold text-gray-800">🎥 Real-Time Mood Tracker</h2>

//       {/* 🟢 Mood Trend Chart */}
//       <MoodTrendChart data={moodTrendData} />

//       {/* 🎥 Webcam */}
//       <video
//         ref={videoRef}
//         autoPlay
//         className="w-full max-w-md rounded-md border shadow-sm"
//       />

//       {isStreaming ? (
//         <button
//           onClick={stopVideoStream}
//           className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           ⏹️ Stop Webcam
//         </button>
//       ) : (
//         <button
//           onClick={restartWebcam}
//           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           🔄 Restart Webcam
//         </button>
//       )}

//       {mood && (
//         <p className="text-lg font-semibold text-gray-700">
//           Detected Mood: <span className="text-blue-600">{mood}</span>{" "}
//           {confidence !== null && (
//             <>
//               (Confidence:{" "}
//               <span className="text-green-500">{(confidence * 100).toFixed(2)}%</span>)
//             </>
//           )}
//         </p>
//       )}

//       {error && <p className="text-red-500 font-medium">{error}</p>}

//       {/* 📜 Raw Mood History Display */}
//       <MoodHistory userId="user123" />
//     </div>
//   );
// }








































"use client"

import { useEffect, useRef, useState } from "react"
import { MoodTrendChart } from "./MoodTrendChart"
import MoodHistory from "@/components/mood-tracker/MoodHistory"

export default function MoodTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mood, setMood] = useState<string>("")
  const [confidence, setConfidence] = useState<number | null>(null)
  const [error, setError] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [moodTrendData, setMoodTrendData] = useState<
    { date: string; mood: number; journal?: string }[]
  >([])

  useEffect(() => {
    const startVideo = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = newStream
          setStream(newStream)
          setIsStreaming(true)
        }
        startFrameCapture()
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setError("Error accessing webcam. Please allow camera permissions.")
      }
    }

    startVideo()
    fetchMoodTrendData()

    return () => {
      stopVideoStream()
    }
  }, [])

  const fetchMoodTrendData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/mood_history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch mood trend data")
      }

      const data = await response.json()

      const chartData = data.history.map((entry: any) => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        mood: moodToScore(entry.mood),
        journal: entry.journal || "",
      }))
      setMoodTrendData(chartData)
    } catch (err) {
      console.error("Error fetching mood trend:", err)
    }
  }

  const moodToScore = (mood: string): number => {
    const moodMap: { [key: string]: number } = {
      happy: 5,
      excited: 4,
      neutral: 3,
      sad: 2,
      angry: 1,
      depressed: 1,
    }
    return moodMap[mood.toLowerCase()] || 3
  }

  const startFrameCapture = () => {
    const intervalId = setInterval(() => {
      captureFrame()
    }, 2000)
    return () => clearInterval(intervalId)
  }

  const stopVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsStreaming(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const captureFrame = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setError("Webcam not loaded. Please refresh and try again.")
      return
    }

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) {
      setError("Error capturing video frame.")
      return
    }

    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("Error capturing image.")
        return
      }

      const formData = new FormData()
      formData.append("file", blob, "frame.jpg")

      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://127.0.0.1:8000/mood_detect", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setMood(data.mood)
        setConfidence(data.confidence)
      } catch (err) {
        console.error("Error predicting mood:", err)
        setError("Error predicting mood. Please try again.")
      }
    }, "image/jpeg")
  }

  const restartWebcam = async () => {
    stopVideoStream()
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        setStream(newStream)
        setIsStreaming(true)
        startFrameCapture()
      }
    } catch (err) {
      console.error("Error restarting webcam:", err)
      setError("Error restarting webcam.")
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-6">
      <h2 className="text-xl font-bold text-gray-800">🎥 Real-Time Mood Tracker</h2>

      {/* 🟢 Mood Trend Chart */}
      <MoodTrendChart data={moodTrendData} />

      {/* 🎥 Webcam */}
      <video
        ref={videoRef}
        autoPlay
        className="w-full max-w-md rounded-md border shadow-sm"
      />

      {isStreaming ? (
        <button
          onClick={stopVideoStream}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          ⏹️ Stop Webcam
        </button>
      ) : (
        <button
          onClick={restartWebcam}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          🔄 Restart Webcam
        </button>
      )}

      {mood && (
        <p className="text-lg font-semibold text-gray-700">
          Detected Mood: <span className="text-blue-600">{mood}</span>{" "}
          {confidence !== null && (
            <>
              (Confidence:{" "}
              <span className="text-green-500">{(confidence * 100).toFixed(2)}%</span>)
            </>
          )}
        </p>
      )}

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* 📜 Raw Mood History Display */}
      <MoodHistory userId="user123"/>
    </div>
  )
}