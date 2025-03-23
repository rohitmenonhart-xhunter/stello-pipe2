#!/bin/bash

# This script creates placeholder preview images for templates
# Requires ImageMagick (https://imagemagick.org/) to be installed
# Install with: brew install imagemagick (Mac) or sudo apt-get install imagemagick (Linux)

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first."
    echo "Mac: brew install imagemagick"
    echo "Linux: sudo apt-get install imagemagick"
    echo "Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

# Base directories
PUBLIC_DIR="public"
TEMPLATES_DIR="$PUBLIC_DIR/templates"

# Create directories if they don't exist
mkdir -p "$TEMPLATES_DIR/react/corporate-modern/images"
mkdir -p "$TEMPLATES_DIR/react/shop-modern/images"
mkdir -p "$TEMPLATES_DIR/nextjs/business-pro/images"
mkdir -p "$TEMPLATES_DIR/nextjs/store-pro/images"

# Create preview images
echo "Creating template preview images..."

# Dimensions for preview images (16:10 aspect ratio)
WIDTH=1280
HEIGHT=800

# Function to generate preview image with template name
generate_preview() {
    local dir=$1
    local name=$2
    local file="$TEMPLATES_DIR/$dir/preview.png"
    
    # Create a gradient background with text
    convert -size ${WIDTH}x${HEIGHT} \
        gradient:blue-purple \
        -font Arial -pointsize 60 -gravity center \
        -fill white -annotate 0 "$name" \
        -fill white -gravity south -pointsize 24 -annotate +0+50 "Preview Image" \
        "$file"
    
    echo "Created $file"
}

# Generate preview images for each template
generate_preview "react/corporate-modern" "Corporate Modern"
generate_preview "react/shop-modern" "Shop Modern"
generate_preview "nextjs/business-pro" "Business Pro"
generate_preview "nextjs/store-pro" "Store Pro"

# Generate some sample component images
echo "Creating sample component images..."

# Hero images (16:9 aspect ratio)
convert -size 1920x1080 gradient:blue-purple -font Arial -pointsize 40 -gravity center -fill white -annotate 0 "Hero Background" "$TEMPLATES_DIR/react/corporate-modern/images/hero-bg.jpg"
convert -size 1920x800 gradient:green-blue -font Arial -pointsize 40 -gravity center -fill white -annotate 0 "Hero Banner" "$TEMPLATES_DIR/react/shop-modern/images/hero-banner.jpg"
convert -size 1920x1080 gradient:purple-pink -font Arial -pointsize 40 -gravity center -fill white -annotate 0 "Hero Background" "$TEMPLATES_DIR/nextjs/business-pro/images/hero-bg.jpg"
convert -size 1920x800 gradient:orange-yellow -font Arial -pointsize 40 -gravity center -fill white -annotate 0 "Hero Banner" "$TEMPLATES_DIR/nextjs/store-pro/images/hero-banner.jpg"

# Team member photos (square aspect ratio)
for i in 1 2 3; do
    convert -size 400x400 -gravity center plasma:fractal \
        -font Arial -pointsize 30 -gravity center -fill white \
        -annotate 0 "Team Member $i" \
        "$TEMPLATES_DIR/react/corporate-modern/images/team-$i.jpg"
    
    convert -size 400x400 -gravity center plasma:fractal \
        -font Arial -pointsize 30 -gravity center -fill white \
        -annotate 0 "Team Member $i" \
        "$TEMPLATES_DIR/nextjs/business-pro/images/team-$i.jpg"
done

# Product images (square aspect ratio)
for i in 1 2 3 4; do
    convert -size 600x600 -gravity center plasma:fractal \
        -font Arial -pointsize 30 -gravity center -fill white \
        -annotate 0 "Product $i" \
        "$TEMPLATES_DIR/react/shop-modern/images/product-$i.jpg"
    
    convert -size 600x600 -gravity center plasma:fractal \
        -font Arial -pointsize 30 -gravity center -fill white \
        -annotate 0 "Product $i" \
        "$TEMPLATES_DIR/nextjs/store-pro/images/product-$i.jpg"
done

# Category images
convert -size 400x300 gradient:blue-cyan -font Arial -pointsize 24 -gravity center -fill white -annotate 0 "Category 1" "$TEMPLATES_DIR/react/shop-modern/images/category-1.jpg"
convert -size 400x300 gradient:pink-purple -font Arial -pointsize 24 -gravity center -fill white -annotate 0 "Category 2" "$TEMPLATES_DIR/react/shop-modern/images/category-2.jpg"
convert -size 400x300 gradient:blue-cyan -font Arial -pointsize 24 -gravity center -fill white -annotate 0 "Clothing" "$TEMPLATES_DIR/nextjs/store-pro/images/category-clothing.jpg"
convert -size 400x300 gradient:pink-purple -font Arial -pointsize 24 -gravity center -fill white -annotate 0 "Accessories" "$TEMPLATES_DIR/nextjs/store-pro/images/category-accessories.jpg"

echo "Done! Created all template preview images."
echo "To view them, start your development server and navigate to the template selection page." 