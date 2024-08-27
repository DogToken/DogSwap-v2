import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, styled } from '@mui/material';
import { FaTwitter, FaDiscord, FaTelegram, FaGithub } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#ffffff', // White background
  color: '#000000', // Textcolor
  padding: theme.spacing(4, 0), // Reduced padding
  marginTop: theme.spacing(4), // Margin to create space above the footer
  borderTop: '1px solid #e0e0e0', // Light border at the top of the footer
  position: 'relative',
  bottom: 0,
  width: '100%',
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: '1.5rem', // Adjusted font size
  marginBottom: theme.spacing(1), // Reduced bottom margin
  color: '#000000', // Black text for the logo
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '2rem', // Adjusted icon size
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#000000', // Black text for links
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.primary.main, // Change to primary color on hover
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: '#000000', // Black icons
  '&:hover': {
    color: theme.palette.primary.main, // Primary color on hover
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light background on hover
  },
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <LogoTypography variant="h6">
              <IoMdPaw /> DogSwap
            </LogoTypography>
            <Typography variant="body2">
              The ultimate crypto swap platform for dog lovers.
            </Typography>
            <Box mt={1}>
              <SocialButton aria-label="Twitter">
                <FaTwitter />
              </SocialButton>
              <SocialButton aria-label="Discord">
                <FaDiscord />
              </SocialButton>
              <SocialButton aria-label="Telegram">
                <FaTelegram />
              </SocialButton>
              <SocialButton aria-label="GitHub">
                <FaGithub />
              </SocialButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Home</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Swap</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Liquidity</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Farms</StyledLink>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Resources
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Docs</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Whitepaper</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Blog</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">FAQs</StyledLink>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Legal
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Terms of Service</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Privacy Policy</StyledLink>
            </Typography>
            <Typography variant="body2">
              <StyledLink href="#">Cookie Policy</StyledLink>
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} DogSwap. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
