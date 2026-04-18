import os
from PIL import Image
import numpy as np

try:
    # Input and output paths
    input_path = r'c:\Users\sdpya\Desktop\online\frontend\public\WhatsApp Image 2026-04-01 at 3.47.44 PM.jpeg'
    output_path = r'c:\Users\sdpya\Desktop\online\frontend\public\WhatsApp Image 2026-04-01 at 3.47.44 PM.png'
    
    print(f"Reading image from: {input_path}")
    
    # Open the image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Convert image to numpy array
    img_array = np.array(img)
    
    # Extract RGB and Alpha channels
    r, g, b, a = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2], img_array[:,:,3]
    
    # Detect light backgrounds (white or very light colors)
    # Calculate luminance
    luminance = (0.299 * r + 0.587 * g + 0.114 * b)
    
    # Make pixels with high luminance (light colors) transparent
    # Threshold: 220 (on scale of 0-255)
    background_mask = luminance > 220
    img_array[background_mask, 3] = 0  # Set alpha to 0 (transparent)
    
    # Convert back to PIL Image
    result_img = Image.fromarray(img_array, 'RGBA')
    
    # Save the image
    result_img.save(output_path)
    
    print(f"✅ Background removed successfully!")
    print(f"Image saved as PNG with transparency: {output_path}")
    
except ImportError:
    print("Installing required package: Pillow...")
    os.system("pip install Pillow numpy")
    print("Please run the script again.")
except Exception as e:
    print(f"Error: {e}")
