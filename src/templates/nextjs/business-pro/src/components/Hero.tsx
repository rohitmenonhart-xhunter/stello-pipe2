import React from 'react';
import { Box, Container, Typography, Button, styled } from '@mui/material';

interface HeroProps {
  content: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  style: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    padding: 'small' | 'medium' | 'large';
    alignment: 'left' | 'center' | 'right';
  };
}

const HeroSection = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'backgroundColor' && 
    prop !== 'textColor' && 
    prop !== 'padding' && 
    prop !== 'alignment'
})<{
  backgroundColor: string;
  textColor: string;
  padding: string;
  alignment: string;
}>(({ backgroundColor, textColor, padding, alignment }) => ({
  backgroundColor: backgroundColor,
  color: textColor,
  padding: padding === 'small' ? '2rem 0' : padding === 'large' ? '6rem 0' : '4rem 0',
  textAlign: alignment as 'left' | 'center' | 'right',
}));

const Hero: React.FC<HeroProps> = ({ content, style }) => {
  return (
    <HeroSection
      backgroundColor={style.backgroundColor}
      textColor={style.textColor}
      padding={style.padding}
      alignment={style.alignment}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 800, mx: style.alignment === 'center' ? 'auto' : 0 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2
            }}
          >
            {content.title}
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              opacity: 0.8,
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            {content.subtitle}
          </Typography>
          
          {content.buttonText && (
            <Button 
              variant="contained" 
              href={content.buttonUrl || '#'}
              size="large"
              sx={{ 
                backgroundColor: style.accentColor,
                '&:hover': {
                  backgroundColor: `${style.accentColor}cc`
                },
                px: 4,
                py: 1.5
              }}
            >
              {content.buttonText}
            </Button>
          )}
        </Box>
      </Container>
    </HeroSection>
  );
};

export default Hero; 