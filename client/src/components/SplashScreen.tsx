import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled components
const SplashContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  overflow: 'hidden',
}));

const LogoContainer = styled(Box)({
  animation: `${float} 3s ease-in-out infinite`,
  marginBottom: '2rem',
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 800,
  color: 'white',
  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
  letterSpacing: '0.1em',
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: 'rgba(255,255,255,0.9)',
  marginBottom: '3rem',
  animation: `${fadeIn} 1s ease-out 0.5s both`,
  textAlign: 'center',
  maxWidth: '400px',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  animation: `${fadeIn} 1s ease-out 1s both`,
});

const LoadingText = styled(Typography)({
  color: 'rgba(255,255,255,0.8)',
  fontSize: '1rem',
  fontWeight: 500,
});

const BuildInfo = styled(Typography)({
  position: 'absolute',
  bottom: '2rem',
  right: '2rem',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.875rem',
  fontFamily: 'monospace',
});

const ProgressBar = styled(Box)({
  width: '200px',
  height: '4px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: '2px',
  overflow: 'hidden',
  marginTop: '1rem',
});

const ProgressFill = styled(Box)({
  height: '100%',
  background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
  borderRadius: '2px',
  transition: 'width 0.3s ease',
});

// Floating particles
const Particle = styled(Box)({
  position: 'absolute',
  width: '4px',
  height: '4px',
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: '50%',
  animation: `${float} 4s ease-in-out infinite`,
});

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Applikasjonen starter opp...');

  // Get build number from environment or use timestamp
  const buildNumber = process.env.REACT_APP_BUILD_NUMBER || 
    '20241201-001';

  useEffect(() => {
    const loadingSteps = [
      { text: 'Applikasjonen starter opp...', progress: 20 },
      { text: 'Laster komponenter...', progress: 40 },
      { text: 'Initialiserer database...', progress: 60 },
      { text: 'Forbereder grensesnitt...', progress: 80 },
      { text: 'Ferdig!', progress: 100 },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        setProgress(step.progress);
        currentStep++;
      } else {
        clearInterval(interval);
        // Wait a bit more before completing
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <Particle
      key={i}
      sx={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  ));

  return (
    <SplashContainer>
      {/* Floating particles */}
      {particles}
      
      <Fade in timeout={1000}>
        <LogoContainer>
          <LogoText variant="h1">
            NMCS
          </LogoText>
        </LogoContainer>
      </Fade>

      <Subtitle variant="h6">
        Norwegian Marine & Cargo Survey
        <br />
        Order Management System
      </Subtitle>

      <LoadingContainer>
        <LoadingText>{loadingText}</LoadingText>
        <CircularProgress 
          size={40} 
          thickness={4}
          sx={{ 
            color: 'white',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        <ProgressBar>
          <ProgressFill sx={{ width: `${progress}%` }} />
        </ProgressBar>
      </LoadingContainer>

      <BuildInfo>
        Build: {buildNumber}
      </BuildInfo>
    </SplashContainer>
  );
};

export default SplashScreen;
