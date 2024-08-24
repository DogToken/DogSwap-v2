import React from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Paper container with custom theme
const PaperContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  maxWidth: 700,
  margin: "auto",
  marginTop: theme.spacing(10), // Adjusted margin for better spacing
  backgroundColor: theme.palette.background.paper, // Ensuring background color
}));

// Styled Title with custom theme
const Title = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.primary, // Use theme color for text
}));

// Styled Footer with custom theme
const Footer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(8),
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center", // Center align text for better appearance
  padding: theme.spacing(2),
}));

export default function ConnectWalletPage() {
  return (
    <div>
      {/* Title Section */}
      <div className="Title">
        <Typography variant="h4" align="center" gutterBottom>
          DogSwap
        </Typography>
      </div>

      {/* Main Content */}
      <Container>
        <PaperContainer>
          <Title variant="h6">
            Please connect an Ethereum wallet to your browser to use the application.
          </Title>
        </PaperContainer>
      </Container>

      {/* Footer Section */}
      <Footer container direction="row">
      </Footer>
    </div>
  );
}
