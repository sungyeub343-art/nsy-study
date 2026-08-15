import os
import random
import shutil

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Get available image files
available_images = []
for file in os.listdir('.'):
    if file.lower().endswith(('.jpg', '.jpeg', '.png')):
        if not file.startswith('review-photo') and not file.startswith(('depositphotos', 'ged-image', 'international-image', 'tutoring-landing')):
            available_images.append(file)

print(f'Available photos: {len(available_images)} files')

# Select 3 random images
selected_images = random.sample(available_images, 3)
print('Selected photos:')
for i, img in enumerate(selected_images, 1):
    print(f'  {i}. {img}')

# Backup existing review photos
for i in range(1, 4):
    old_file = f'review-photo-{i}.jpg'
    backup_file = f'review-photo-{i}.jpg.bak'
    if os.path.exists(old_file):
        shutil.copy2(old_file, backup_file)
        print(f'Backup created: {backup_file}')

# Copy selected images to review-photo files
for i, img in enumerate(selected_images, 1):
    src = os.path.join('.', img)
    dst = f'review-photo-{i}.jpg'
    shutil.copy2(src, dst)
    print(f'Copied: {img} -> {dst}')

print('Review photos updated successfully!')
