# Website Templates

This directory contains all the website templates available in the application. Each template is organized in its own folder with the following structure:

## Directory Structure

```
templates/
├── react/
│   ├── corporate-modern/
│   │   ├── template.json
│   │   ├── preview.png
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── ...
│   ├── shop-modern/
│   │   ├── template.json
│   │   ├── preview.png
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── ...
│   └── ...
├── nextjs/
│   ├── business-pro/
│   │   ├── template.json
│   │   ├── preview.png
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── ...
│   ├── store-pro/
│   │   ├── template.json
│   │   ├── preview.png
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── ...
│   └── ...
└── index.ts
```

## Template Configuration

Each template has a `template.json` file that defines its metadata:

```json
{
  "id": "corporate-modern",
  "name": "Corporate Modern",
  "description": "A sleek, professional template for corporate websites with a clean design and modern features.",
  "tags": ["corporate", "business", "professional", "modern"],
  "framework": "react",
  "version": "1.0.0",
  "author": "Your Company",
  "editableComponents": [
    {
      "id": "header",
      "name": "Header",
      "path": "src/components/Header.jsx"
    },
    {
      "id": "hero",
      "name": "Hero Section",
      "path": "src/components/Hero.jsx"
    },
    // ... other editable components
  ]
}
```

## Template Index

The `index.ts` file exports all available templates with their metadata for use in the application.

## Adding New Templates

To add a new template:

1. Create a new directory in the appropriate framework folder (react or nextjs)
2. Add the template source code in the `src` directory
3. Create a `template.json` file with the template metadata
4. Add a high-quality `preview.png` image
5. Update the `index.ts` file to include the new template

## Using Templates

Templates can be previewed, customized, and downloaded through the application's visual editor. 