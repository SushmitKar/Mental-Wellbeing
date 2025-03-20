import numpy as np
import pandas as pd
from prediction import predictions

# Get predicted class index
predicted_class = np.argmax(predictions, axis=1)

# Define class labels (adjust if needed)
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Print predicted emotion
for i, pred in enumerate(predicted_class):
    print(f"Image {i+1}: Predicted Emotion - {class_labels[pred]}")

#     # Prepare datasets for retraining
# AUTOTUNE = tf.data.AUTOTUNE
# train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
# val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

data = {
    'Image_name' : [f'image_{i+1}.jpg' for i in range (len(predicted_class))],
    'Predicted_Label' : [class_labels[idx] for idx in predicted_class]
}

df = pd.DataFrame(data)
df.to_csv('predictions.csv', index=False)
print('Predicitons done')