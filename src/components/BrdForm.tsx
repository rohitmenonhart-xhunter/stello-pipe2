import React, { useState } from 'react';
import { BrdAnswers } from '../App';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Grid, 
  Paper, 
  useTheme, 
  alpha,
  Chip
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import WebIcon from '@mui/icons-material/Web';
import TargetIcon from '@mui/icons-material/TrackChanges';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface BrdFormProps {
  onSubmit: (answers: BrdAnswers) => void;
}

interface Page {
  id: string;
  label: string;
  sections: string[];
  required?: boolean;
}

export const BrdForm: React.FC<BrdFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [businessType, setBusinessType] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home', 'Contact Us']);
  
  const [formData, setFormData] = useState<BrdAnswers>({
    businessGoals: '',
    targetAudience: '',
    keyFeatures: '',
    contentTypes: '',
    designPreferences: '',
    technicalRequirements: '',
    timeline: '',
    budget: ''
  });

  const businessTypes = [
    { id: 'corporate', label: 'Corporate/Business', 
      defaultPages: ['Home Page', 'About Us', 'Services', 'Case Studies', 'Contact Us'] },
    { id: 'ecommerce', label: 'E-commerce/Shop', 
      defaultPages: ['Home Page', 'Products', 'Pricing', 'Shop', 'Customer Service', 'Contact Us'] },
    { id: 'portfolio', label: 'Portfolio/Creative', 
      defaultPages: ['Home Page', 'About Us', 'Case Studies', 'Services', 'Contact Us'] },
    { id: 'saas', label: 'SaaS/Technology', 
      defaultPages: ['Home Page', 'Features', 'Pricing', 'Articles/Blog', 'Contact Us'] },
    { id: 'museum', label: 'Museum/Gallery', 
      defaultPages: ['Home Page', 'Visit', "What's On", 'Shop', 'Learning', 'Contact Us'] }
  ];

  const availablePages: Page[] = [
    { id: 'homepage', label: 'Home Page', sections: ['Hero', 'Features', 'Call to Action'], required: true },
    { id: 'landing', label: 'Landing Page', sections: ['Hero', 'Benefits', 'Call to Action'] },
    { id: 'about', label: 'About Us', sections: ['Our History', 'Team', 'Mission'] },
    { id: 'services', label: 'Services', sections: ['Service List', 'Benefits', 'Pricing'] },
    { id: 'products', label: 'Products', sections: ['Product List', 'Features', 'Specifications'] },
    { id: 'pricing', label: 'Pricing', sections: ['Plans', 'Features', 'FAQ'] },
    { id: 'careers', label: 'Careers', sections: ['Open Positions', 'Benefits', 'Culture'] },
    { id: 'articles', label: 'Articles/Blog', sections: ['Recent Posts', 'Categories', 'Featured'] },
    { id: 'case-studies', label: 'Case Studies', sections: ['Projects', 'Results', 'Testimonials'] },
    { id: 'contact', label: 'Contact Us', sections: ['Form', 'Map', 'Info'], required: true },
    { id: 'visit', label: 'Visit', sections: ['Getting here', 'Opening hours', 'Contact Info'] },
    { id: 'whatson', label: "What's On", sections: ['Exhibits', 'Music Events'] },
    { id: 'shop', label: 'Shop', sections: ['Store Pages', 'Products', 'Categories'] },
    { id: 'learning', label: 'Learning', sections: ['Teacher Resources', 'Activity Sheets'] },
    { id: 'support', label: 'Support', sections: ['Volunteering', 'Fundraising', 'Donate'] },
    { id: 'customer-service', label: 'Customer Service', sections: ['FAQ', 'Contact', 'Returns'] },
    { id: 'account', label: 'Account', sections: ['Login', 'Register', 'Orders'] },
    { id: 'resources', label: 'Resources', sections: ['Blog', 'Guides', 'Events'] },
    { id: 'investors', label: 'Investors', sections: ['Reports', 'Governance', 'Stock Info'] }
  ];

  const handleBusinessTypeChange = (type: string) => {
    setBusinessType(type);
    const selectedType = businessTypes.find(t => t.id === type);
    if (selectedType) {
      // Combine required pages with business type default pages
      const requiredPages = availablePages
        .filter(page => page.required)
        .map(page => page.label);
      const newPages = [...new Set([...requiredPages, ...selectedType.defaultPages])];
      setSelectedPages(newPages);
    }
  };

  const handlePageSelection = (page: string) => {
    if (page === 'Homepage' || page === 'Contact Us') return; // Can't deselect required pages
    
    setSelectedPages(prev => 
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      contentTypes: selectedPages.join(', '),
      keyFeatures: `Business Type: ${businessType}, Selected Pages: ${selectedPages.join(', ')}`
    });
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      className="fade-in"
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          maxWidth: 900, 
          mx: 'auto',
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #6200EA, #B388FF)',
          }
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6200EA, #B388FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}
        >
          Business Requirements Document
        </Typography>
        
        {/* Business Type Selection */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <BusinessIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              What type of business are you creating the website for?
            </Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="business-type-label">Select Business Type</InputLabel>
              <Select
                labelId="business-type-label"
                value={businessType}
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
                label="Select Business Type"
                required
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select a business type</em>
                </MenuItem>
                {businessTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Page Selection */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <WebIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Select the pages you need
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                color: theme.palette.text.secondary
              }}
            >
              Homepage and Contact are required
            </Typography>
            <Grid container spacing={1}>
              {availablePages.map(page => (
                <Grid item xs={12} sm={6} md={4} key={page.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPages.includes(page.label)}
                        onChange={() => handlePageSelection(page.label)}
                        disabled={page.required}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {page.label}
                        {page.required && (
                          <Chip 
                            label="Required" 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              height: 20, 
                              fontSize: '0.625rem',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                            }} 
                          />
                        )}
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Business Goals */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <BusinessIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              What are your main business goals for the website?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.businessGoals}
              onChange={(e) => setFormData({ ...formData, businessGoals: e.target.value })}
              variant="outlined"
              required
              placeholder="Describe your business goals..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Target Audience */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <TargetIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Who is your target audience?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              variant="outlined"
              required
              placeholder="Describe your target audience..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Design Preferences */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <PaletteIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Design Preferences
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.designPreferences}
              onChange={(e) => setFormData({ ...formData, designPreferences: e.target.value })}
              variant="outlined"
              required
              placeholder="Describe your design preferences (style, colors, modern features)..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Technical Requirements */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start' }}>
          <CodeIcon 
            sx={{ 
              mr: 2, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Any specific technical requirements or integrations needed?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.technicalRequirements}
              onChange={(e) => setFormData({ ...formData, technicalRequirements: e.target.value })}
              variant="outlined"
              placeholder="Describe any technical requirements or integrations..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            />
          </Box>
        </Box>

        {/* Timeline and Budget */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <AccessTimeIcon 
                sx={{ 
                  mr: 2, 
                  color: theme.palette.primary.main,
                  fontSize: 28
                }} 
              />
              <Box sx={{ width: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Project Timeline
                </Typography>
                <TextField
                  fullWidth
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  variant="outlined"
                  required
                  placeholder="e.g., 3 months, Q4 2023, etc."
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <AccountBalanceWalletIcon 
                sx={{ 
                  mr: 2, 
                  color: theme.palette.primary.main,
                  fontSize: 28
                }} 
              />
              <Box sx={{ width: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Budget Range
                </Typography>
                <TextField
                  fullWidth
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  variant="outlined"
                  required
                  placeholder="e.g., $5,000-$10,000, etc."
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(98, 0, 234, 0.4)',
              background: 'linear-gradient(90deg, #6200EA, #B388FF)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(98, 0, 234, 0.5)',
                background: 'linear-gradient(90deg, #5000D6, #A370FF)',
              }
            }}
          >
            Generate Information Architecture
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};