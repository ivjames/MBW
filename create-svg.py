from PIL import Image
import numpy as np
from scipy.ndimage import binary_erosion, label, binary_dilation

# Load image
img = Image.open("assets/images/logo-mark.png")
arr = np.array(img.convert("RGBA"))
alpha = arr[:, :, 3]

# Binary mask of non-transparent pixels
binary_mask = alpha > 200

# Clean up and label regions
cleaned = binary_dilation(binary_mask, iterations=1)
cleaned = binary_erosion(cleaned, iterations=1)
labeled, num = label(cleaned)

# Start SVG
svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 {img.width} {img.height}" xmlns="http://www.w3.org/2000/svg" width="{img.width}" height="{img.height}">
  <defs>
    <style>
      .logo-region {{ fill: #f8e40a; stroke: none; }}
    </style>
  </defs>
"""

# For each region, create a polygon
for region_id in range(1, num + 1):
    region_mask = labeled == region_id

    # Find boundary points
    boundary = region_mask & ~binary_erosion(region_mask)
    points = np.argwhere(boundary)  # (y, x) format

    if len(points) > 4:
        # Sort by angle from centroid
        cy, cx = points.mean(axis=0)
        angles = np.arctan2(points[:, 0] - cy, points[:, 1] - cx)
        sorted_idx = np.argsort(angles)
        sorted_points = points[sorted_idx]

        # Create polygon
        poly_pts = " ".join([f"{int(p[1])},{int(p[0])}" for p in sorted_points])
        svg += f'  <polygon points="{poly_pts}" class="logo-region"/>\n'

svg += "</svg>"

with open("assets/images/logo-mark.svg", "w") as f:
    f.write(svg)

print(f"Created logo-mark.svg ({len(svg)} bytes)")
