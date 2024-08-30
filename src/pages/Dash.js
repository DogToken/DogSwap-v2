import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Avatar, Button, TextField, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/system';
import { ethers } from 'ethers';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';

// Assuming these utility functions exist in your project
import { getProvider, getSigner } from '../utils/ethereumFunctions';

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  height: '200px',
  position: 'relative',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.background.paper}`,
  marginTop: '-50px',
}));

const ProfileDashboard = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    bio: '',
    email: '',
    website: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...profileInfo });

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const provider = await getProvider();
        const signer = await getSigner(provider);
        const address = await signer.getAddress();
        setWalletAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));

        // Fetch recent transactions (placeholder)
        const recentTx = [
          { hash: '0x123...', value: '0.1 ETH', to: '0xabc...' },
          { hash: '0x456...', value: '0.05 ETH', to: '0xdef...' },
        ];
        setTransactions(recentTx);

        // Fetch profile info (placeholder)
        setProfileInfo({
          name: 'Satoshi Nakamoto',
          bio: 'Blockchain enthusiast and developer',
          email: 'satoshi@example.com',
          website: 'https://example.com',
        });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    };

    connectWallet();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setProfileInfo(editedInfo);
    } else {
      setEditedInfo({ ...profileInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo({ ...editedInfo, [name]: value });
  };

  const handleLogout = () => {
    setWalletAddress('');
    setBalance('');
    setTransactions([]);
    // Add any additional logout logic here
  };

  return (
    <Container maxWidth="lg">
      <ProfileHeader>
        <Container>
          <ProfileAvatar src="/api/placeholder/200/200" alt="Profile" />
        </Container>
      </ProfileHeader>
      <Box mt={2} mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4">
              {isEditing ? (
                <TextField
                  name="name"
                  value={editedInfo.name}
                  onChange={handleInputChange}
                  fullWidth
                />
              ) : (
                profileInfo.name
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Profile Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Bio</Typography>
            {isEditing ? (
              <TextField
                name="bio"
                value={editedInfo.bio}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            ) : (
              <Typography>{profileInfo.bio}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email</Typography>
            {isEditing ? (
              <TextField
                name="email"
                value={editedInfo.email}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <Typography>{profileInfo.email}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Website</Typography>
            {isEditing ? (
              <TextField
                name="website"
                value={editedInfo.website}
                onChange={handleInputChange}
                fullWidth
              />
            ) : (
              <Typography>{profileInfo.website}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Wallet Balance</Typography>
            <Typography>{balance} ETH</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.hash}</TableCell>
                  <TableCell>{tx.value}</TableCell>
                  <TableCell>{tx.to}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mb={4}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        This is a demo profile. In a real application, you would fetch actual data from the blockchain and implement proper authentication and data management.
      </Alert>
    </Container>
  );
};

export default ProfileDashboard;