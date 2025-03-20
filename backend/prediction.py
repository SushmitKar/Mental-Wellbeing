#To predict on a Single New Image--

import tensorflow as tf
import numpy as np
from keras.models import load_model
from tensorflow.keras import layers

# model = load_model("backend/Mood_Dataset_extracted/emotion_model.keras")

# Load and preprocess the image
# Load new test data from directory (without labels)
new_data = tf.keras.utils.image_dataset_from_directory(
    directory='backend/Mood_Dataset_extracted/test',
    labels=None,                   # No labels for prediction
    batch_size=32,
    image_size=(224, 224),
    shuffle=False                   # Keep order consistent for prediction
)

normalization_layer = layers.Rescaling(1./255)

# Apply rescaling to test data
new_data = new_data.map(lambda x: normalization_layer(x))

# Make predictions
# Get predictions
predictions = model.predict(new_data)
