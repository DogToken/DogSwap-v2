import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material"; 
import Home from "./Home"; 
import Footer from "../Components/Footer/Footer"; 
import NarBar from "../Components/NavBar/NavBar"; 

const ConnectWalletPage = () => {
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [promptUser, setPromptUser] = useState(true); // New state to prompt user

  // Replace with your desired network details
  const desiredNetworkId = '24734'; 
  const desiredNetworkName = 'MintMe SmartChain';
  const rpcUrl = 'https://node.1000x.ch';
  const chainIdHex = '0x609e';

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== desiredNetworkId) {
          setWrongNetwork(true);
          setOpenModal(true); 
        } else {
          setPromptUser(false); // No need to prompt if already on the correct network
        }
      } else {
        setOpenModal(true); // Show modal if there's no wallet
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
      setOpenModal(false); // Close modal when network is switched
    } catch (switchError) {
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
                  name: "MintMe Coin",
                  symbol: "MINTME",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mintme.com/explorer"],
              },
            ],
          });
          setWrongNetwork(false);
          setOpenModal(false); 
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleContinueBrowsing = () => {
    setPromptUser(false); // Allow browsing without wallet
    setOpenModal(false); // Close the modal
  };

  return (
    <div>
      {/* Render NavBar */}
      <NarBar />

      {/* Render Home Page */}
      <Home />

      {/* Modal for Wallet Information */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Wallet Information</DialogTitle>
        <DialogContent>
          <Typography>
            {wrongNetwork
              ? `You're connected to the wrong network. Please switch to ${desiredNetworkName}.`
              : 'You are currently browsing without a connected wallet. Some features may not be available.'}
          </Typography>
          {promptUser && (
            <Typography>
              Would you like to connect your wallet or continue browsing without it?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {promptUser ? (
            <>
              <Button onClick={switchNetwork} color="primary">
                Connect Wallet
              </Button>
              <Button onClick={handleContinueBrowsing} color="secondary">
                Continue Browsing
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseModal} color="primary">
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Render Footer */}
      <Footer />
    </div>
  );
};

export default ConnectWalletPage;
