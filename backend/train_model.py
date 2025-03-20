import os
import tensorflow
from tensorflow.keras.utils import image_dataset_from_directory
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam


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


normalization_layer = tensorflow.keras.layers.Rescaling(1./255)

#Applying normalization to traininga and validating datasets
train_dataset = train_dataset.map(lambda x,y : (normalization_layer(x), y))
val_dataset = val_dataset.map(lambda x,y : (normalization_layer(x), y))

#CNN model  
model = Sequential([
    Input(shape=(224, 224, 3)),
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(128, activation="relu"),
    Dropout(0.5),
    Dense(7, activation="softmax")
])

#Compile the model
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)


#Train the model
EPOCHS = 25
history= model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS
)

# Save the trained model
model.save('backend/Mood_Dataset_extracted/emotion_model.keras')
print('Model Training and Saving Complete') 
# model.summary()