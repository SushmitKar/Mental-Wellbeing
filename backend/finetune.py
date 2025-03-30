from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Flatten, Dense
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

#   Step 1: Load Pretrained Model
model = load_model('backend/far2013+/moodmodel.keras')
print("  Model loaded successfully with input shape (224, 224, 3)!")


#   Step 2: Data Augmentation (Stronger Augmentation for Better Generalization)
datagen = ImageDataGenerator(
    rotation_range=10,  # Lower rotation
    width_shift_range=0.05,
    height_shift_range=0.05,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    rescale=1.0 / 255
)


#   Step 3: Load Training and Test Data
train_generator = datagen.flow_from_directory(
    'backend/datasets/comdatasplit/train',
    target_size=(224, 224),  
    batch_size=32,
    color_mode='rgb',
    class_mode='categorical'
)

test_generator = datagen.flow_from_directory(
    'backend/datasets/comdatasplit/test',
    target_size=(224, 224),
    batch_size=32,
    color_mode='rgb',
    class_mode='categorical',
    shuffle=False
)

#   Step 4: Ensure Output Layer Matches the Dataset
# Avoid re-adding Flatten & Dense layers if already present
if model.output_shape[-1] != 7:
    print("⚠️ Adjusting output layer to match 7 emotion classes...")
    new_model = Sequential()
    for layer in model.layers[:-1]:  # Keep all layers except the last one
        new_model.add(layer)
    
    new_model.add(Dense(7, activation='softmax'))  # 7 emotion categories
    model = new_model
    print("  Output layer adjusted!")

#   Step 5: Compute Class Weights (Handle Class Imbalance)
print(train_generator.class_indices)  # Verify class mappings

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_generator.classes),
    y=train_generator.classes.tolist()  # Convert to list
)

class_weights_dict = dict(enumerate(class_weights))
print("  Class Weights:", class_weights_dict)

#   Step 6: Compile Model (with Optimized Learning Rate)
model.compile(
    optimizer=Adam(learning_rate=5e-4, amsgrad=True),  # More stable optimizer
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

#   Step 7: Fine-Tune with Early Stopping   
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    min_lr=1e-6,
    verbose=1
)

model.fit(
    train_generator,
    epochs=30,
    steps_per_epoch=len(train_generator),
    validation_data=test_generator,
    validation_steps=len(test_generator),
    class_weight=class_weights_dict,
    callbacks=[early_stopping, reduce_lr],
    verbose=1
)

#   Step 8: Save Updated Model
model.save('backend/moodmodel_v2.keras')
print("  Fine-tuning complete! Model saved as moodmodel_v2.keras.")

#   Step 9: Evaluate on Test Data
loss, accuracy = model.evaluate(test_generator)
print(f"  Fine-Tuned Model Accuracy: {accuracy * 100:.2f}%")

import matplotlib.pyplot as plt

# Plot training & validation accuracy
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Val Accuracy')
plt.title('Model Accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(loc='lower right')
plt.show()

# Plot training & validation loss
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(loc='upper right')
plt.show()
