import { Template } from '../App';

// Define the extended template type with additional metadata
export interface TemplateMetadata extends Template {
  version: string;
  author: string;
  editableComponents: {
    id: string;
    name: string;
    path: string;
    type: 'header' | 'hero' | 'section' | 'footer' | 'navigation' | 'form' | 'card' | 'text' | 'image' | 'button';
  }[];
}

// React templates
const reactTemplates: TemplateMetadata[] = [
  {
    id: 'corporate-modern',
    name: 'Corporate Modern',
    description: 'A sleek, professional template for corporate websites with a clean design and modern features.',
    imageUrl: '/templates/react/corporate-modern/preview.png',
    tags: ['corporate', 'business', 'professional', 'modern'],
    framework: 'react',
    previewUrl: '/editor/preview/corporate-modern',
    version: '1.0.0',
    author: 'Your Company',
    editableComponents: [
      {
        id: 'header',
        name: 'Header',
        path: 'src/components/Header.jsx',
        type: 'header'
      },
      {
        id: 'hero',
        name: 'Hero Section',
        path: 'src/components/Hero.jsx',
        type: 'hero'
      },
      {
        id: 'services',
        name: 'Services Section',
        path: 'src/components/Services.jsx',
        type: 'section'
      },
      {
        id: 'about',
        name: 'About Section',
        path: 'src/components/About.jsx',
        type: 'section'
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        path: 'src/components/Testimonials.jsx',
        type: 'section'
      },
      {
        id: 'contact',
        name: 'Contact Form',
        path: 'src/components/ContactForm.jsx',
        type: 'form'
      },
      {
        id: 'footer',
        name: 'Footer',
        path: 'src/components/Footer.jsx',
        type: 'footer'
      }
    ]
  },
  {
    id: 'shop-modern',
    name: 'Shop Modern',
    description: 'A modern e-commerce template with product galleries and shopping cart functionality.',
    imageUrl: '/templates/react/shop-modern/preview.png',
    tags: ['ecommerce', 'shop', 'products'],
    framework: 'react',
    previewUrl: '/editor/preview/shop-modern',
    version: '1.0.0',
    author: 'Your Company',
    editableComponents: [
      {
        id: 'header',
        name: 'Header',
        path: 'src/components/Header.jsx',
        type: 'header'
      },
      {
        id: 'hero',
        name: 'Hero Banner',
        path: 'src/components/HeroBanner.jsx',
        type: 'hero'
      },
      {
        id: 'featured-products',
        name: 'Featured Products',
        path: 'src/components/FeaturedProducts.jsx',
        type: 'section'
      },
      {
        id: 'categories',
        name: 'Product Categories',
        path: 'src/components/ProductCategories.jsx',
        type: 'section'
      },
      {
        id: 'newsletter',
        name: 'Newsletter Signup',
        path: 'src/components/Newsletter.jsx',
        type: 'form'
      },
      {
        id: 'footer',
        name: 'Footer',
        path: 'src/components/Footer.jsx',
        type: 'footer'
      }
    ]
  }
];

// Next.js templates
const nextjsTemplates: TemplateMetadata[] = [
  {
    id: 'business-pro',
    name: 'Business Pro',
    description: 'Feature-rich business template with sections for services, team, and testimonials.',
    imageUrl: '/templates/nextjs/business-pro/preview.png',
    tags: ['corporate', 'business', 'services'],
    framework: 'nextjs',
    previewUrl: '/editor/preview/business-pro',
    version: '1.0.0',
    author: 'Your Company',
    editableComponents: [
      {
        id: 'header',
        name: 'Header',
        path: 'src/components/Header.tsx',
        type: 'header'
      },
      {
        id: 'hero',
        name: 'Hero Section',
        path: 'src/components/Hero.tsx',
        type: 'hero'
      },
      {
        id: 'services',
        name: 'Services Section',
        path: 'src/components/Services.tsx',
        type: 'section'
      },
      {
        id: 'team',
        name: 'Team Section',
        path: 'src/components/Team.tsx',
        type: 'section'
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        path: 'src/components/Testimonials.tsx',
        type: 'section'
      },
      {
        id: 'contact',
        name: 'Contact Form',
        path: 'src/components/ContactForm.tsx',
        type: 'form'
      },
      {
        id: 'footer',
        name: 'Footer',
        path: 'src/components/Footer.tsx',
        type: 'footer'
      }
    ]
  },
  {
    id: 'store-pro',
    name: 'Store Pro',
    description: 'Advanced e-commerce template with category filtering and product search.',
    imageUrl: '/templates/nextjs/store-pro/preview.png',
    tags: ['ecommerce', 'shop', 'products', 'advanced'],
    framework: 'nextjs',
    previewUrl: '/editor/preview/store-pro',
    version: '1.0.0',
    author: 'Your Company',
    editableComponents: [
      {
        id: 'header',
        name: 'Header',
        path: 'src/components/Header.tsx',
        type: 'header'
      },
      {
        id: 'hero',
        name: 'Hero Banner',
        path: 'src/components/HeroBanner.tsx',
        type: 'hero'
      },
      {
        id: 'featured-products',
        name: 'Featured Products',
        path: 'src/components/FeaturedProducts.tsx',
        type: 'section'
      },
      {
        id: 'product-grid',
        name: 'Product Grid',
        path: 'src/components/ProductGrid.tsx',
        type: 'section'
      },
      {
        id: 'filters',
        name: 'Product Filters',
        path: 'src/components/ProductFilters.tsx',
        type: 'navigation'
      },
      {
        id: 'newsletter',
        name: 'Newsletter Signup',
        path: 'src/components/Newsletter.tsx',
        type: 'form'
      },
      {
        id: 'footer',
        name: 'Footer',
        path: 'src/components/Footer.tsx',
        type: 'footer'
      }
    ]
  }
];

// Combine all templates
export const allTemplates: TemplateMetadata[] = [...reactTemplates, ...nextjsTemplates];

// Helper function to get template by ID
export const getTemplateById = (id: string): TemplateMetadata | undefined => {
  return allTemplates.find(template => template.id === id);
};

// Helper function to get templates by business type
export const getTemplatesByBusinessType = (businessType: string): TemplateMetadata[] => {
  return allTemplates.filter(template => 
    template.tags.includes(businessType.toLowerCase())
  );
};

// Helper function to get templates by framework
export const getTemplatesByFramework = (framework: 'react' | 'nextjs'): TemplateMetadata[] => {
  return allTemplates.filter(template => template.framework === framework);
};

export default allTemplates; 