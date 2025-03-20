import os

model_path = 'backend\Mood_Dataset_extracted\emotion_model.keras'  # or .h5 if using old format
file_size = os.path.getsize(model_path) / (1024 * 1024)  # Size in MB
print(f"Model Size: {file_size:.2f} MB")
