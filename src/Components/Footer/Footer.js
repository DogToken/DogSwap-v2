import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, styled, useTheme } from '@mui/material';
import { FaDiscord, FaTelegram, FaGithub, FaXTwitter } from 'react-icons/fa6';
import { IoMdPaw } from 'react-icons/io';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  color: '#333',
  padding: theme.spacing(6, 0, 4),
  marginTop: theme.spacing(8),
  borderTop: '1px solid #e0e0e0',
  position: 'relative',
  overflow: 'hidden',
}));

const LogoTypography = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '2.5rem',
  },
  animation: 'fadeInUp 0.5s ease-out',
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#555',
  textDecoration: 'none',
  transition: 'color 0.3s ease, transform 0.3s ease',
  display: 'inline-block',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
}));


const SocialLink = styled('a')(({ theme }) => ({
  color: '#555',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const GradientBackground = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
  zIndex: 0,
});

const ContentWrapper = styled('div')({
  position: 'relative',
  zIndex: 1,
});

const AnimatedSection = styled('div')(({ theme, delay }) => ({
  animation: 'fadeInUp 0.5s ease-out',
  animationDelay: delay,
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const Footer = () => {
  const theme = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { icon: FaXTwitter, url: 'https://x.com/DogSwapDeFi', label: 'X' },
    { icon: FaDiscord, url: 'https://discord.gg/RSQZDGThfU', label: 'Discord' },
    { icon: FaTelegram, url: 'https://t.me/DogSwapOfficial', label: 'Telegram' },
    { icon: FaGithub, url: 'https://github.com/DogToken', label: 'GitHub' },
  ];

  const getLinksForSection = (section) => {
    switch (section) {
      case 'Quick Links':
        return [
          { text: 'Home', href: '/' },
          { text: 'Swap', href: '/swap' },
          { text: 'Liquidity', href: '/liquidity' },
          { text: 'Pools', href: '/pools' },
        ];
      case 'Resources':
        return [
          { text: 'Docs', href: 'https://docs.dogswap.xyz/', external: true },
          { text: 'Whitepaper', href: 'https://raw.githubusercontent.com/DogToken/DogSwap-v2/main/Whitepaper.md', external: true },
          { text: 'MintMe', href: 'https://mintme.com/token/DogSwap/', external: true },
          { text: 'FAQs', href: '/faq' },
        ];
      case 'Legal':
        return [
          { text: 'Terms of Service', href: '/terms' },
          { text: 'Privacy Policy', href: '/privacy' },
          { text: 'Cookie Policy', href: '/cookies' },
        ];
      default:
        return [];
    }
  };

  return (
    <StyledFooter>
      <GradientBackground />
      <Container maxWidth="lg">
        <ContentWrapper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <LogoTypography>
                <IoMdPaw /> DogSwap
              </LogoTypography>
              <Typography variant="body2" sx={{ mb: 2, maxWidth: '300px' }}>
                Revolutionizing DeFi on the MintMe SmartChain. Swap tokens, earn rewards, and shape the future of finance.
              </Typography>
              <Box>
                {socialLinks.map((social, index) => (
                  <SocialLink
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconButton component="span">
                      <social.icon />
                    </IconButton>
                  </SocialLink>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {['Quick Links', 'Resources', 'Legal'].map((section, index) => (
                  <Grid item xs={12} sm={4} key={section}>
                    <AnimatedSection delay={`${index * 0.1}s`}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                        {section}
                      </Typography>
                      <Box component="nav">
                        {getLinksForSection(section).map((link, i) => (
                          <Typography variant="body2" key={i} sx={{ mb: 1 }}>
                            <StyledLink href={link.href} target={link.external ? "_blank" : "_self"}>
                              {link.text}
                            </StyledLink>
                          </Typography>
                        ))}
                      </Box>
                    </AnimatedSection>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {year} DogSwap. All rights reserved.
            </Typography>
          </Box>
        </ContentWrapper>
      </Container>
    </StyledFooter>
  );
};

export default Footer;