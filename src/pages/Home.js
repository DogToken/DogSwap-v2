import React from 'react';
import { Box, Typography, Container, Grid, Card, Stack } from '@mui/material';
import { styled } from '@mui/system';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import Features from '../Components/Home/Features';
import Hero from '../Components/Home/Hero';
import FAQ from '../Components/Home/FAQ';
import About from '../Components/Home/About';

// Custom styled components

const Highlights = () => {
  const items = [
    {
      icon: <SwapHorizRoundedIcon />,
      title: 'Seamless Token Swaps',
      description:
        'Trade tokens with ease on DogSwap, benefiting from fast, secure, and transparent swaps powered by DeFi innovation.',
    },
    {
      icon: <MonetizationOnRoundedIcon />,
      title: 'Earn with Liquidity',
      description:
        'Provide liquidity and earn rewards in BONE while helping build a more liquid and accessible DeFi ecosystem.',
    },
    {
      icon: <LockRoundedIcon />,
      title: 'Secure and Trusted',
      description:
        'Security is our top priority. Your assets and data are protected through industry-standard security practices.',
    },
    {
      icon: <TrendingUpRoundedIcon />,
      title: 'Stake and Grow',
      description:
        'Maximize your earnings by staking BONE and participating in governance to shape the future of DogSwap.',
    },
    {
      icon: <SupportRoundedIcon />,
      title: '24/7 Community Support',
      description:
        'Our dedicated team and active community are always here to support your DogSwap journey, no matter where you are.',
    },
    {
      icon: <InsightsRoundedIcon />,
      title: 'Data-Driven Insights',
      description:
        'Make informed decisions with real-time insights and analytics, empowering you to navigate the DeFi space with confidence.',
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
