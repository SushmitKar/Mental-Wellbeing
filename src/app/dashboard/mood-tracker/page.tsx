import MoodTracker from "./moodtracker";

export default function MoodTrackerPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Real-Time Mood Tracker</h1>
      <MoodTracker />
    </div>
  );
}
