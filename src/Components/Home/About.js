import React from 'react';
import { Box, Container, Grid, Typography, Stack, Paper } from '@mui/material';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

const About = () => {
  const items = [
    {
      icon: <SwapHorizRoundedIcon style={{ fontSize: 40 }} />,
      title: 'Seamless Token Swaps',
      description:
        'Trade tokens with ease on DogSwap, benefiting from fast, secure, and transparent swaps powered by DeFi innovation.',
    },
    {
      icon: <MonetizationOnRoundedIcon style={{ fontSize: 40 }} />,
      title: 'Earn with Liquidity',
      description:
        'Provide liquidity and earn rewards in BONE while helping build a more liquid and accessible DeFi ecosystem.',
    },
    {
      icon: <LockRoundedIcon style={{ fontSize: 40 }} />,
      title: 'Secure and Trusted',
      description:
        'Security is our top priority. Your assets and data are protected through industry-standard security practices.',
    },
    {
      icon: <TrendingUpRoundedIcon style={{ fontSize: 40 }} />,
      title: 'Stake and Grow',
      description:
        'Maximize your earnings by staking BONE and participating in governance to shape the future of DogSwap.',
    },
    {
      icon: <SupportRoundedIcon style={{ fontSize: 40 }} />,
      title: '24/7 Community Support',
      description:
        'Our dedicated team and active community are always here to support your DogSwap journey, no matter where you are.',
    },
    {
      icon: <InsightsRoundedIcon style={{ fontSize: 40 }} />,
      title: 'Data-Driven Insights',
      description:
        'Make informed decisions with real-time insights and analytics, empowering you to navigate the DeFi space with confidence.',
    },
  ];

  return (
    <Box
      id="about"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        bgcolor: 'grey.900',
        color: 'white',
      }}
    >
      <Container>
        {/* Hero Header */}
        <Typography variant="h3" gutterBottom align="center">
          About DogSwap
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.400', mb: 4 }} align="center">
          DogSwap is dedicated to providing a seamless, secure, and rewarding DeFi experience. Explore our platform and discover how you can benefit from our unique features.
        </Typography>

        <Grid container spacing={4}>
          {/* Left Side: Mission Statement */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'grey.800', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                At DogSwap, we believe in empowering users through accessible and innovative decentralized finance solutions. Our platform is built with community, transparency, and security at its core.
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Join us in our journey as we redefine the DeFi landscape and create opportunities for all.
              </Typography>
            </Paper>
          </Grid>

          {/* Right Side: Features List */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <Stack spacing={2}>
              {items.map((item, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'grey.800',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ color: 'primary.main', mr: 2 }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.400' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;