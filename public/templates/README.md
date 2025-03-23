# Template Images Guide

This directory contains all template images used in the application. Each template has its own folder with preview images and component-specific images.

## Directory Structure

```
public/templates/
├── react/
│   ├── corporate-modern/
│   │   ├── preview.png         # Main template preview image
│   │   └── images/             # Component-specific images
│   │       ├── hero-bg.jpg
│   │       ├── about.jpg
│   │       ├── team-1.jpg
│   │       └── ...
│   ├── shop-modern/
│   │   ├── preview.png
│   │   └── images/
│   │       ├── hero-banner.jpg
│   │       ├── product-1.jpg
│   │       └── ...
│   └── ...
├── nextjs/
│   ├── business-pro/
│   │   ├── preview.png
│   │   └── images/
│   │       ├── hero-bg.jpg
│   │       ├── team-1.jpg
│   │       └── ...
│   ├── store-pro/
│   │   ├── preview.png
│   │   └── images/
│   │       ├── hero-banner.jpg
│   │       ├── product-1.jpg
│   │       └── ...
│   └── ...
└── README.md                   # This file
```

## Image Guidelines

### Preview Images
- Main template preview image
- Filename: `preview.png`
- Recommended dimensions: 1280×800px (16:10 ratio)
- Format: PNG (preferred) or JPEG

### Component Images
All component-specific images should be placed in the `images/` folder within each template's directory.

#### Common Component Image Types:

1. **Hero Images**
   - Dimensions: 1920×1080px (16:9) or 1920×800px (hero banners)
   - Format: JPEG or WebP for photos, SVG or PNG for illustrations

2. **Team Member Photos**
   - Dimensions: 400×400px (1:1 square)
   - Format: JPEG or WebP

3. **Product Images**
   - Dimensions: 600×600px (1:1 square)
   - Format: JPEG or WebP with transparent background

4. **Category Images**
   - Dimensions: 400×300px or 800×600px
   - Format: JPEG or WebP

5. **Icons and Logos**
   - Dimensions: Varies (typically 24×24px to 200×50px)
   - Format: SVG (preferred) or PNG with transparent background

## Adding New Images

1. Place your image in the appropriate template directory
2. Update the template configuration in `src/templates/index.ts` to include your new image
3. Reference the image in your template components using the path: `/templates/{framework}/{template-id}/images/{filename}`

## Generating Placeholders

For development purposes, you can generate placeholder images using the script:

```bash
./scripts/create-template-previews.sh
```

This script requires ImageMagick to be installed.

## Best Practices

1. Optimize all images for web using tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Use descriptive filenames (e.g., `hero-banner.jpg` instead of `img1.jpg`)
3. Keep image dimensions consistent within each category
4. Use SVG for logos and icons whenever possible
5. Consider providing multiple resolutions for responsive designs 