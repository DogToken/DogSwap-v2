import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  Container, Typography, Paper, 
  Snackbar, Alert, useTheme
} from '@mui/material';
import { styled } from '@mui/system';

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

const TermsAndConditions = () => {
  const theme = useTheme();

  useEffect(() => {
    // Track page view for Google Analytics
    ReactGA.send({ hitType: 'pageview', page: '/terms' });
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <Title variant="h2" gutterBottom>
          Terms and Conditions
        </Title>

        <Typography variant="body1" paragraph>
          Welcome to DogSwap. These terms and conditions explain the rules and regulations for using our website and services.
        </Typography>

        <SectionHeading variant="h4">1. Introduction</SectionHeading>
        <Typography variant="body2" paragraph>
          By accessing or using this website, you agree to comply with the terms and conditions set forth in this document. Failure to comply may result in restricted access or legal action.
        </Typography>

        <SectionHeading variant="h4">
          2. Intellectual Property Rights
        </SectionHeading>
        <Typography variant="body2" paragraph>
          All content on this website, including text, images, graphics, and code, is the intellectual property of DogSwap. You may not duplicate or distribute any content without explicit permission.
        </Typography>

        <SectionHeading variant="h4">
          3. Use of Our Website
        </SectionHeading>
        <Typography variant="body2" paragraph>
          Our website is provided for personal and non-commercial use. Unauthorized use of the website, such as attempts to disrupt the service or hack into accounts, is strictly prohibited.
        </Typography>

        <SectionHeading variant="h4">4. Limitation of Liability</SectionHeading>
        <Typography variant="body2" paragraph>
          We strive to ensure that our website is secure and functional. However, we are not responsible for any damages, loss of data, or security breaches that may occur while using our services.
        </Typography>

        <SectionHeading variant="h4">5. Governing Law</SectionHeading>
        <Typography variant="body2" paragraph>
          These terms are governed by the laws under the European Union. Any disputes arising from the use of this website will be resolved under these governing laws.
        </Typography>

        <SectionHeading variant="h4">6. Amendments to Terms</SectionHeading>
        <Typography variant="body2" paragraph>
          We may update these terms periodically. You are responsible for reviewing these terms regularly to stay informed about any changes. Continued use of the site indicates your acceptance of the updated terms.
        </Typography>

        <SectionHeading variant="h4">7. Privacy Policy</SectionHeading>
        <Typography variant="body2" paragraph>
          Please review our <a href="/privacy" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>Privacy Policy</a> to understand how we collect and handle your personal information.
        </Typography>

        <SectionHeading variant="h4">8. Contact Us</SectionHeading>
        <Typography variant="body2" paragraph>
          If you have any questions about these terms, feel free to contact us at via chat or via mail.
        </Typography>

        {/* Snackbar for notifications */}
        <Snackbar open={false} autoHideDuration={6000}>
          <Alert severity="info">Thank you for reviewing our terms!</Alert>
        </Snackbar>
      </StyledPaper>
    </StyledContainer>
  );
};

export default TermsAndConditions;
