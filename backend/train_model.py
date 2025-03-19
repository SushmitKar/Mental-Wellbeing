import os
import tensorflow as tf
import keras
from tensorflow import keras
from keras import image_dataset_from_directory
from keras import Sequential
from keras import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras import Adam


train_dataset = image_dataset_from_directory(
    directory='backend/Mood_Dataset_extracted/train',
    labels='inferred',
    label_mode='categorical',  # Or 'binary' for binary classification
    batch_size=32,
    image_size=(224, 224), #Resizing to desired size
    shuffle=True,
    seed=42,
    validation_split=0.2,
    subset='training'
)

# Define path to validation dataset
val_dataset = image_dataset_from_directory(
    directory='backend/Mood_Dataset_extracted/train',  # Same directory as train, since we are splitting
    labels='inferred',
    label_mode='categorical',
    batch_size=32,
    image_size=(224, 224),
    shuffle=True,
    seed=42,
    validation_split=0.2,
    subset='validation'  # Validation split
)


normalization_layer = keras.Rescaling(1./255)

#Applying normalization to traininga and validating datasets
train_dataset = train_dataset.map(lambda x,y : (normalization_layer(x), y))
val_dataset = val_dataset.map(lambda x,y : (normalization_layer(x), y))

#CNN model
model = Sequential()

#Conv layer1
model.add(Conv2D(32, (3,3)))
