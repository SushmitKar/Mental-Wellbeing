// "use client";
// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


// const moodToScore = (mood) => {
//   const moodMap = {
//     happy: 5,
//     excited: 4,
//     neutral: 3,
//     sad: 2,
//     angry: 1,
//     depressed: 0,
//   };
//   return moodMap[mood.toLowerCase()] || 3; // default to neutral if unknown
// };


// export default function MoodHistory({ userId }) {
//   const [moodHistory, setMoodHistory] = useState([]);

//   useEffect(() => {
//     fetchMoodHistory();
//   }, []);

//   const fetchMoodHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:8000/mood_history/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch mood history");
//       }

//       const data = await response.json();
//       setMoodHistory(data.history); // ✅ This was the main issue
//       const chartData = data.history.map((entry) => ({
//         date: new Date(entry.timestamp).toLocaleDateString(),
//         moodScore: moodToScore(entry.mood),
//       }));
//       setMoodChartData(chartData);      
//     } catch (error) {
//       console.error("Error fetching mood history:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md">
      
//       <h2 className="text-xl font-bold mb-4">Mood History</h2>
//       {moodHistory.length === 0 ? (
//         <p>No mood data available yet!</p>
//       ) : (
//         <div className="max-h-64 overflow-y-auto pr-2">
//           <ul className="space-y-2">
//             {moodHistory.map((mood, index) => (
//               <li
//                 key={index}
//                 className="flex justify-between text-sm p-2 bg-gray-100 rounded-md"
//               >
//                 <span className="capitalize">{mood.mood}</span>
//                 <span>{new Date(mood.timestamp).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// MoodHistory.propTypes = {
//   userId: PropTypes.string.isRequired,
// };










"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Convert mood strings to numerical scores
const moodToScore = (mood) => {
  const moodMap = {
    happy: 5,
    excited: 4,
    neutral: 3,
    sad: 2,
    angry: 1,
    depressed: 0,
  };
  return moodMap[mood.toLowerCase()] || 3; // default to neutral
};

export default function MoodHistory({ userId }) {
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodChartData, setMoodChartData] = useState([]);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/mood_history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mood history");
      }

      const data = await response.json();
      setMoodHistory(data.history);

      const chartData = data.history.map((entry) => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        moodScore: moodToScore(entry.mood),
      }));

      setMoodChartData(chartData);
    } catch (error) {
      console.error("Error fetching mood history:", error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Mood History</h2>

      {moodHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No mood data available yet!</p>
      ) : (
        <>
          {/* Mood Trend Line Chart */}
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mood History List */}
          <div className="max-h-64 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {moodHistory.map((mood, index) => (
                <li
                  key={index}
                  className="flex justify-between text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                >
                  <span className="capitalize text-gray-700 dark:text-gray-200">{mood.mood}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(mood.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

MoodHistory.propTypes = {
  userId: PropTypes.string.isRequired,
};
