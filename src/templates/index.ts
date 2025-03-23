import { Template } from '../services/userService';

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
  images?: {
    id: string;
    name: string;
    path: string;
    usage: string;
    dimensions?: string;
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
    ],
    images: [
      {
        id: 'hero-image',
        name: 'Hero Background',
        path: '/templates/react/corporate-modern/images/hero-bg.jpg',
        usage: 'Background image for the hero section',
        dimensions: '1920x1080'
      },
      {
        id: 'about-image',
        name: 'About Section Image',
        path: '/templates/react/corporate-modern/images/about.jpg',
        usage: 'Image for the about section',
        dimensions: '800x600'
      },
      {
        id: 'team-member-1',
        name: 'Team Member 1',
        path: '/templates/react/corporate-modern/images/team-1.jpg',
        usage: 'Team member photo',
        dimensions: '400x400'
      },
      {
        id: 'team-member-2',
        name: 'Team Member 2',
        path: '/templates/react/corporate-modern/images/team-2.jpg',
        usage: 'Team member photo',
        dimensions: '400x400'
      },
      {
        id: 'logo',
        name: 'Company Logo',
        path: '/templates/react/corporate-modern/images/logo.svg',
        usage: 'Company logo in header and footer',
        dimensions: '200x50'
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
    ],
    images: [
      {
        id: 'hero-banner',
        name: 'Hero Banner',
        path: '/templates/react/shop-modern/images/hero-banner.jpg',
        usage: 'Main banner image for the homepage',
        dimensions: '1920x800'
      },
      {
        id: 'product-1',
        name: 'Product 1',
        path: '/templates/react/shop-modern/images/product-1.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'product-2',
        name: 'Product 2',
        path: '/templates/react/shop-modern/images/product-2.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'product-3',
        name: 'Product 3',
        path: '/templates/react/shop-modern/images/product-3.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'category-1',
        name: 'Category 1',
        path: '/templates/react/shop-modern/images/category-1.jpg',
        usage: 'Product category image',
        dimensions: '400x300'
      },
      {
        id: 'category-2',
        name: 'Category 2',
        path: '/templates/react/shop-modern/images/category-2.jpg',
        usage: 'Product category image',
        dimensions: '400x300'
      },
      {
        id: 'logo',
        name: 'Shop Logo',
        path: '/templates/react/shop-modern/images/logo.svg',
        usage: 'Shop logo in header and footer',
        dimensions: '200x50'
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
    ],
    images: [
      {
        id: 'hero-bg',
        name: 'Hero Background',
        path: '/templates/nextjs/business-pro/images/hero-bg.jpg',
        usage: 'Background image for the hero section',
        dimensions: '1920x1080'
      },
      {
        id: 'services-icon-1',
        name: 'Service Icon 1',
        path: '/templates/nextjs/business-pro/images/service-1.svg',
        usage: 'Icon for service 1',
        dimensions: '64x64'
      },
      {
        id: 'services-icon-2',
        name: 'Service Icon 2',
        path: '/templates/nextjs/business-pro/images/service-2.svg',
        usage: 'Icon for service 2',
        dimensions: '64x64'
      },
      {
        id: 'services-icon-3',
        name: 'Service Icon 3',
        path: '/templates/nextjs/business-pro/images/service-3.svg',
        usage: 'Icon for service 3',
        dimensions: '64x64'
      },
      {
        id: 'team-member-1',
        name: 'Team Member 1',
        path: '/templates/nextjs/business-pro/images/team-1.jpg',
        usage: 'Team member photo',
        dimensions: '400x400'
      },
      {
        id: 'team-member-2',
        name: 'Team Member 2',
        path: '/templates/nextjs/business-pro/images/team-2.jpg',
        usage: 'Team member photo',
        dimensions: '400x400'
      },
      {
        id: 'team-member-3',
        name: 'Team Member 3',
        path: '/templates/nextjs/business-pro/images/team-3.jpg',
        usage: 'Team member photo',
        dimensions: '400x400'
      },
      {
        id: 'logo',
        name: 'Business Logo',
        path: '/templates/nextjs/business-pro/images/logo.svg',
        usage: 'Business logo in header and footer',
        dimensions: '200x50'
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
    ],
    images: [
      {
        id: 'hero-banner',
        name: 'Store Hero Banner',
        path: '/templates/nextjs/store-pro/images/hero-banner.jpg',
        usage: 'Main banner image for the homepage',
        dimensions: '1920x800'
      },
      {
        id: 'product-1',
        name: 'Product 1',
        path: '/templates/nextjs/store-pro/images/product-1.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'product-2',
        name: 'Product 2',
        path: '/templates/nextjs/store-pro/images/product-2.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'product-3',
        name: 'Product 3',
        path: '/templates/nextjs/store-pro/images/product-3.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'product-4',
        name: 'Product 4',
        path: '/templates/nextjs/store-pro/images/product-4.jpg',
        usage: 'Featured product image',
        dimensions: '600x600'
      },
      {
        id: 'category-clothing',
        name: 'Clothing Category',
        path: '/templates/nextjs/store-pro/images/category-clothing.jpg',
        usage: 'Category image',
        dimensions: '400x300'
      },
      {
        id: 'category-accessories',
        name: 'Accessories Category',
        path: '/templates/nextjs/store-pro/images/category-accessories.jpg',
        usage: 'Category image',
        dimensions: '400x300'
      },
      {
        id: 'logo',
        name: 'Store Logo',
        path: '/templates/nextjs/store-pro/images/logo.svg',
        usage: 'Store logo in header and footer',
        dimensions: '200x50'
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

// Helper function to get all images for a specific template
export const getTemplateImages = (templateId: string): { id: string; name: string; path: string; usage: string; dimensions?: string }[] => {
  const template = getTemplateById(templateId);
  return template?.images || [];
};

export default allTemplates; 