from emotion_tracker import app

@app.get("/recommendations")
def get_recommendations(user_id: str):
    # Sample logic
    recommendations = [
        {
            "title": "Morning Meditation",
            "text": "A 10-minute morning meditation could help reduce your anxiety levels."
        },
        {
            "title": "Evening Journal",
            "text": "Try journaling before bed to process your day and improve sleep."
        }
    ]
    return {"recommendations": recommendations}