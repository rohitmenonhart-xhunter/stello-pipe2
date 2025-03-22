import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Typography, Tabs, Tab, Chip, Stack, useTheme, Paper, alpha } from '@mui/material';
import { Template } from '../App';
import { allTemplates, getTemplatesByBusinessType } from '../templates';

interface TemplatesProps {
  businessType: string;
  onSelectTemplate: (template: Template) => void;
}

const Templates: React.FC<TemplatesProps> = ({ businessType, onSelectTemplate }) => {
  const theme = useTheme();
  const [framework, setFramework] = useState<'react' | 'nextjs'>('react');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    // First filter by business type
    let templates = getTemplatesByBusinessType(businessType);
    
    // If no templates match the business type, show all templates
    if (templates.length === 0) {
      templates = allTemplates;
    }
    
    // Then filter by framework
    templates = templates.filter(template => template.framework === framework);
    
    setFilteredTemplates(templates);
  }, [businessType, framework]);

  const handleFrameworkChange = (_event: React.SyntheticEvent, newValue: 'react' | 'nextjs') => {
    setFramework(newValue);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <Box 
      sx={{ 
        py: 6, 
        background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.03), rgba(179, 136, 255, 0.07))'
      }}
      className="fade-in"
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            animation: 'slideUp 0.8s ease-out'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6200EA, #B388FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Select a Template
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '700px',
              mx: 'auto',
              mb: 5
            }}
          >
            Choose a template that best fits your {businessType} website needs. 
            Each template is fully customizable to match your brand.
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            mb: 5,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            animation: 'slideUp 1s ease-out',
          }}
        >
          <Tabs
            value={framework}
            onChange={handleFrameworkChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 600,
                py: 2,
                px: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  opacity: 1,
                },
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab label="React" value="react" />
            <Tab label="Next.js" value="nextjs" />
          </Tabs>
        </Paper>
        
        {filteredTemplates.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              px: 4,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              No templates found for this combination. Try changing the framework.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={4} className="slide-up">
            {filteredTemplates.map((template, index) => (
              <Grid item xs={12} md={6} key={template.id} sx={{ 
                animation: `slideUp ${0.3 + index * 0.1}s ease-out`
              }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: selectedTemplate === template.id 
                      ? `2px solid ${theme.palette.primary.main}` 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: selectedTemplate === template.id 
                      ? `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}` 
                      : '0 10px 30px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    },
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                  }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={template.imageUrl || '/placeholder-template.png'}
                      alt={template.name}
                      sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    {selectedTemplate === template.id && (
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        zIndex: 2,
                      }}>
                        ✓
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1
                      }}
                    >
                      {template.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph
                      sx={{ mb: 2 }}
                    >
                      {template.description}
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        mb: 3, 
                        flexWrap: 'wrap', 
                        gap: 1 
                      }}
                    >
                      {template.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            }
                          }}
                        />
                      ))}
                    </Stack>
                    <Button
                      variant={selectedTemplate === template.id ? "contained" : "outlined"}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template);
                      }}
                      sx={{
                        py: 1.2,
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: selectedTemplate === template.id ? '0 4px 14px rgba(98, 0, 234, 0.4)' : 'none',
                        '&:hover': {
                          boxShadow: selectedTemplate === template.id 
                            ? '0 6px 20px rgba(98, 0, 234, 0.5)' 
                            : '0 4px 14px rgba(98, 0, 234, 0.2)',
                          backgroundColor: selectedTemplate === template.id 
                            ? theme.palette.primary.dark 
                            : alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      {selectedTemplate === template.id ? "Selected" : "Select This Template"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Templates; 