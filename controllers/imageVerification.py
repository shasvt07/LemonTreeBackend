import sys
from PIL import Image
import imagehash 

def compare_images(image_path1, image_path2):
    # Open images
    img1 = Image.open(image_path1)
    img2 = Image.open(image_path2)

    # Compute perceptual hashes
    hash1 = imagehash.average_hash(img1)
    hash2 = imagehash.average_hash(img2)

    # Calculate hamming distance between the hashes
    similarity = 1 - (hash1 - hash2) / len(hash1.hash) ** 2

    return similarity

# Example usage
image_path1 = "assets/originalAdhaar.jpeg"
image_path2 = sys.argv[1]
similarity_score = compare_images(image_path1, image_path2)

print(f"Similarity between images: {similarity_score}")