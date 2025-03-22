import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  background-color: ${props => props.backgroundColor || '#ffffff'};
  color: ${props => props.textColor || '#333333'};
  padding: ${props => {
    switch(props.padding) {
      case 'small': return '2rem 0';
      case 'large': return '6rem 0';
      default: return '4rem 0';
    }
  }};
  text-align: ${props => props.alignment || 'center'};
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.8;
`;

const HeroButton = styled.a`
  display: inline-block;
  background-color: ${props => props.accentColor || '#1976d2'};
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => {
      const color = props.accentColor || '#1976d2';
      return color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16) * 0.8).map(x => Math.floor(x).toString(16).padStart(2, '0')).join('');
    }};
  }
`;

const Hero = ({ content, style }) => {
  return (
    <HeroContainer 
      backgroundColor={style.backgroundColor}
      textColor={style.textColor}
      padding={style.padding}
      alignment={style.alignment}
    >
      <HeroContent>
        <HeroTitle>{content.title}</HeroTitle>
        <HeroSubtitle>{content.subtitle}</HeroSubtitle>
        {content.buttonText && (
          <HeroButton 
            href={content.buttonUrl || '#'} 
            accentColor={style.accentColor}
          >
            {content.buttonText}
          </HeroButton>
        )}
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero; 