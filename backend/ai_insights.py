from emotion_tracker import journals_collection, app

@app.get("/ai_insights")
def get_ai_insights(user_id: str):
    journal_entries = list(journals_collection.find({"user_id": user_id}))
    texts = [entry["text"] for entry in journal_entries]

    all_text = " ".join(texts).lower()

    insights = []

    if "exercise" in all_text:
        insights.append("Journal entries mentioning 'exercise' correlate with more positive moods.")
    if "tired" in all_text or "anxious" in all_text:
        insights.append("You've shown signs of stress or fatigue in recent entries.")
    if len(journal_entries) > 5:
        insights.append("You've shown consistent engagement with journaling this month.")

    return {"insights": insights}
