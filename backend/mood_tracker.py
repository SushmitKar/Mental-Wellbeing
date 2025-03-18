#Extracting Data
import zipfile, os


zip_file = "backend\Mood Tracker.zip"
extract_folder = "backend\Mood_Dataset_extracted"


with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall(extract_folder)

print("Data set extracted")