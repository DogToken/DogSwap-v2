import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import {
  Container, Typography, Paper,
  Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/system';

// Initialize Google Analytics for page tracking
ReactGA.initialize('G-823N1D2MNZ');

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
  fontFamily: '"Roboto", sans-serif',
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

const CookiePolicy = () => {

  useEffect(() => {
    // Track page view for Google Analytics
    ReactGA.send({ hitType: 'pageview', page: '/cookie-policy' });
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <Title variant="h2" gutterBottom>
          Cookie Policy
        </Title>

        <Typography variant="body1" paragraph>
          This Cookie Policy explains how DogSwap uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control their use.
        </Typography>

        <SectionHeading variant="h4">
          1. What Are Cookies?
        </SectionHeading>
        <Typography variant="body2" paragraph>
          Cookies are small text files that are placed on your device when you visit a website. They allow the website to recognize your device and store some information about your preferences or past actions.
        </Typography>

        <SectionHeading variant="h4">
          2. How We Use Cookies
        </SectionHeading>
        <Typography variant="body2" paragraph>
          We use cookies for several reasons:
          <ul>
            <li><b>Essential Cookies:</b> These are necessary to provide you with services available through our website and to use some of its features.</li>
            <li><b>Performance and Functionality Cookies:</b> These cookies enhance the performance and functionality of our site but are non-essential to its use.</li>
            <li><b>Analytics and Customization Cookies:</b> These collect information used either in aggregate form to help us understand how our website is being used or to customize our website according to your preferences.</li>
            <li><b>Advertising Cookies:</b> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing.</li>
          </ul>
        </Typography>

        <SectionHeading variant="h4">
          3. How You Can Control Cookies
        </SectionHeading>
        <Typography variant="body2" paragraph>
          You have the right to decide whether to accept or reject cookies. You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some features of our site may not function as intended.
        </Typography>

        <SectionHeading variant="h4">
          4. Third-Party Cookies
        </SectionHeading>
        <Typography variant="body2" paragraph>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on.
        </Typography>

        <SectionHeading variant="h4">
          5. Updates to This Cookie Policy
        </SectionHeading>
        <Typography variant="body2" paragraph>
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </Typography>

        <SectionHeading variant="h4">
          6. Contact Us
        </SectionHeading>
        <Typography variant="body2" paragraph>
          If you have any questions about our use of cookies or other technologies, please contact us trough chat or mail.
        </Typography>

        {/* Snackbar for notifications */}
        <Snackbar open={false} autoHideDuration={6000}>
          <Alert severity="info">Thank you for reviewing our Cookie Policy!</Alert>
        </Snackbar>
      </StyledPaper>
    </StyledContainer>
  );
};

export default CookiePolicy;
