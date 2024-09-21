import React from 'react';
import { Box, Typography, Button, Container, Grid, Grid2, Card, CardHeader, CardContent, Avatar, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import Features from '../Components/Home/Features';
import Hero from '../Components/Home/Hero';
import FAQ from '../Components/Home/FAQ';

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background
  padding: theme.spacing(4),
  borderRadius: '8px',
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10%',
  left: '50%',
  transform: 'translate(-50%, -10%)',
  zIndex: -1,
  width: '200px',
  height: '200px',
  backgroundImage: 'url("/path-to-your-image.png")', // Set the background image here
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
}));

const Highlights = () => {
  const items = [
    {
      icon: <SettingsSuggestRoundedIcon />,
      title: 'Adaptable performance',
      description:
        'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
    },
    {
      icon: <ConstructionRoundedIcon />,
      title: 'Built to last',
      description:
        'Experience unmatched durability that goes above and beyond with lasting investment.',
    },
    {
      icon: <ThumbUpAltRoundedIcon />,
      title: 'Great user experience',
      description:
        'Integrate our product into your routine with an intuitive and easy-to-use interface.',
    },
    {
      icon: <AutoFixHighRoundedIcon />,
      title: 'Innovative functionality',
      description:
        'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
    },
    {
      icon: <SupportAgentRoundedIcon />,
      title: 'Reliable support',
      description:
        'Count on our responsive customer support, offering assistance that goes beyond the purchase.',
    },
    {
      icon: <QueryStatsRoundedIcon />,
      title: 'Precision in every detail',
      description:
        'Enjoy a meticulously crafted product where small touches make a significant impact on your overall experience.',
    },
  ];

  return (
    
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: { sm: 'left', md: 'center' } }}>
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Discover why DogSwap stands out: <br></br>
            Accessability, User-Friendly, Open Source and Community based.
            Enjoy reliable customer support, a strong mintme community and passion for every detail.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const Home = () => {
  return (
    <Box sx={{ position: 'relative' }}>

      {/* Main Content */}
      {/* Highlights Section */}
      <Hero />
      <Highlights />
      <Features />
      <FAQ />
    </Box>
  );
};

export default Home;
