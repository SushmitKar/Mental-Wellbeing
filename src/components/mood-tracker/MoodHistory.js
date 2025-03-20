"use client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function MoodHistory({ userId }) {
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/mood_history/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mood history");
      }

      const data = await response.json();
      setMoodHistory(data.mood_history);
    } catch (error) {
      console.error("Error fetching mood history:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Mood History</h2>
      {moodHistory.length === 0 ? (
        <p>No mood data available yet!</p>
      ) : (
        <ul className="space-y-2">
          {moodHistory.map((mood, index) => (
            <li
              key={index}
              className="flex justify-between text-sm p-2 bg-gray-100 rounded-md"
            >
              <span>{mood.mood}</span>
              <span>{new Date(mood.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

MoodHistory.propTypes = {
  userId: PropTypes.string.isRequired,
};