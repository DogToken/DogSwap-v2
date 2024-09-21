import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems'; // Ensure this includes main menu items
import { ethers } from 'ethers';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getBonePriceInUSD } from '../../utils/priceUtils';
import '../../styles/NavBar.css';
import { Avatar, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import defaultAvatar from '../../assets/images/defaultavatar.jpg';
import NewsTickerComponent from './NewsTickerComponent';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(null);
  const [bonePriceInUSD, setBonePriceInUSD] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); // Track active menu item for subnav

  const toggleMenu = () => setIsOpen(!isOpen);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const bonePriceInUSD = await getBonePriceInUSD(provider);

        setBonePriceInUSD(bonePriceInUSD);
        setUserAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  const disconnectWallet = () => {
    setIsConnected(false);
    setBonePriceInUSD(0);
    setShowUserMenu(null);
  };

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }, [connectWallet]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  const handleUserMenuClick = (event) => {
    setShowUserMenu(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setShowUserMenu(null);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <img src="/images/ui/logo.png" alt="DogSwap Logo" className="logo-image" />
              <span className="logo-text">DogSwap</span>
            </Link>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
            {MenuItems.map((item, index) => (
              <li
                key={index}
                className="nav-item"
                onMouseEnter={() => setActiveMenu(index)} // Show subnav on hover
                onMouseLeave={() => setActiveMenu(null)} // Hide subnav on mouse leave
              >
                <Link className="nav-link" to={item.url}>
                  {item.title}
                </Link>
                {activeMenu === index && item.subMenu && (
                  <ul className="subnav">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex} className="subnav-item">
                        <Link className="subnav-link" to={subItem.url}>
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {isConnected && (
              <div className="connected-wallet">
                <Typography variant="body1" sx={{ color: '#4a4a4a', marginRight: '1rem' }}>
                  1 🦴 = ${bonePriceInUSD} USD
                </Typography>

                <div className="user-menu">
                  <IconButton
                    onClick={handleUserMenuClick}
                    sx={{
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Avatar
                      src={defaultAvatar}
                      alt="User Avatar"
                      sx={{
                        cursor: 'pointer',
                        width: 40,
                        height: 40,
                        border: '2px solid #6a9d6d',
                        transition: 'border 0.3s ease',
                        '&:hover': {
                          border: '2px solid #4a4a4a',
                        },
                      }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={showUserMenu}
                    open={Boolean(showUserMenu)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        width: 220,
                      },
                    }}
                  >
                    <MenuItem>
                      <Typography>{formatAddress(userAddress)}</Typography>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/dash" className="user-menu-item">
                        Dashboard
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={disconnectWallet} className="disconnect-button">
                      Disconnect
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            )}
            {!isConnected && (
              <button className="connect-button" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </ul>
        </div>
      </nav>
      <NewsTickerComponent />
    </>
  );
};

export default NavBar;
