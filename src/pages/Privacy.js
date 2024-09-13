import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  Container, Typography, Paper, Box, Button, Tooltip,
  Snackbar, Alert, Slider, useTheme, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

// Initialize Google Analytics for page tracking
ReactGA.initialize('YOUR_GA_TRACKING_ID');

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '800px',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxWidth: '100%',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f5f5',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: '2rem', // Smaller font
  textAlign: 'center',
  fontFamily: '"Roboto", sans-serif', // New font
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  fontFamily: '"Roboto", sans-serif',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Track page view for Google Analytics
    ReactGA.send({ hitType: 'pageview', page: '/privacy-policy' });
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <Title variant="h2" gutterBottom>
          Privacy Policy
        </Title>

        <Typography variant="body1" paragraph>
          At DogSwap, we are committed to protecting your privacy. This privacy policy outlines how we handle your personal data and ensure its safety.
        </Typography>

        <SectionHeading variant="h4">
          1. Information We Collect
        </SectionHeading>
        <Typography variant="body2" paragraph>
          We collect various types of information, including:
          <ul>
            <li><b>Usage Data:</b> information about how you interact with our website, such as page visits, clicks, and browsing history.</li>
            <li><b>Cookies:</b> to enhance user experience and track preferences.</li>
          </ul>
        </Typography>

        <SectionHeading variant="h4">
          2. How We Use Your Information
        </SectionHeading>
        <Typography variant="body2" paragraph>
          Your information is used for the following purposes:
          <ul>
            <li>To provide and maintain our services.</li>
            <li>To notify you about changes or updates to our website or services.</li>
            <li>To improve user experience based on your feedback and behavior.</li>
            <li>To analyze website performance for business insights.</li>
          </ul>
        </Typography>

        <SectionHeading variant="h4">
          3. Sharing Your Information
        </SectionHeading>
        <Typography variant="body2" paragraph>
          We do not sell or share your personal data with third parties, ever

          <ul>
            <li>Even with your consent.</li>
            <li>Even to comply with legal obligations.</li>
            <li>Even to protect the safety and security of our users and website.</li>
          </ul>
          Personal data should never be shared.
        </Typography>

        <SectionHeading variant="h4">4. Security of Your Information</SectionHeading>
        <Typography variant="body2" paragraph>
          We take appropriate security measures to protect your personal data from unauthorized access, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
        </Typography>

        <SectionHeading variant="h4">5. Your Rights</SectionHeading>
        <Typography variant="body2" paragraph>
          Depending on your location, you may have the following rights concerning your personal data:
          <ul>
            <li>The right to access your data.</li>
            <li>The right to request corrections or deletions of your data.</li>
            <li>The right to object to data processing or withdraw consent at any time.</li>
          </ul>
          To exercise these rights, please contact us.
        </Typography>

        <SectionHeading variant="h4">6. Third-Party Links</SectionHeading>
        <Typography variant="body2" paragraph>
          Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external sites.
        </Typography>

        <SectionHeading variant="h4">7. Changes to This Privacy Policy</SectionHeading>
        <Typography variant="body2" paragraph>
          We may update this privacy policy from time to time. Please check this page periodically for updates. Continued use of the website indicates your acceptance of the updated policy.
        </Typography>

        <SectionHeading variant="h4">8. Contact Us</SectionHeading>
        <Typography variant="body2" paragraph>
          If you have any questions or concerns about this privacy policy, please contact us via the chat or via mail.
        </Typography>

        {/* Snackbar for notifications */}
        <Snackbar open={false} autoHideDuration={6000}>
          <Alert severity="info">Thank you for reviewing our Privacy Policy!</Alert>
        </Snackbar>
      </StyledPaper>
    </StyledContainer>
  );
};

export default PrivacyPolicy;
