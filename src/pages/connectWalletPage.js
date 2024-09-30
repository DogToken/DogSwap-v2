import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Button, Box } from "@mui/material";
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

// Styled Button with custom theme
const NetworkButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  color: "#ffffff", // White text
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ConnectWalletPage = () => {
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Replace with your desired network details
  const desiredNetworkId = '24734'; // Example: Ethereum Mainnet
  const desiredNetworkName = 'MintMe SmartChain';
  const rpcUrl = 'https://node.1000x.ch';
  const chainIdHex = '0x609e';

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== desiredNetworkId) {
          setWrongNetwork(true);
        }
      }
    };
    checkNetwork();
  }, []);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      setWrongNetwork(false);
    } catch (switchError) {
      // If the chain has not been added to the wallet, request to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: desiredNetworkName,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: "MintMe Coin", // Replace with the actual name
                  symbol: "MINTME", // Replace with the actual symbol (e.g., ETH for Ethereum)
                  decimals: 18, // Typically 18 decimals
                },
                blockExplorerUrls: ["https://mintme.com/explorer"], // Optional: URL of a block explorer
              },
            ],
          });
          setWrongNetwork(false);
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };
  

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
            {wrongNetwork
              ? `You're either connected to the wrong network or not connected at all. Please switch to ${desiredNetworkName}.`
              : 'Please connect a smart wallet to your browser to use the application.'}
          </Title>
          {wrongNetwork && (
            <Box textAlign="center">
              <NetworkButton onClick={switchNetwork}>
                Switch to {desiredNetworkName}
              </NetworkButton>
            </Box>
          )}
        </PaperContainer>
      </Container>

      {/* Footer Section */}
      <Footer container direction="row">
      </Footer>
    </div>
  );
};

export default ConnectWalletPage;
