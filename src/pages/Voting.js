import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Paper, Button, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { getProvider, getSigner } from '../utils/ethereumFunctions';
import { Contract, ethers } from 'ethers';
import boneTokenABI from '../assets/abi/IERC20.json';
import proposals from '../assets/data/proposals.json'; // Import proposals from JSON file

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '2rem',
}));

const GovernanceVoting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);

  useEffect(() => {
    fetchVoteCounts();
  }, []);

  const fetchVoteCounts = async () => {
    setIsLoading(true);
    try {
      const provider = getProvider();
      const governanceContract = new Contract('0x9d8dd79f2d4ba9e1c3820d7659a5f5d2fa1c22ef', boneTokenABI, provider);

      const counts = await Promise.all(
        proposals.map(async (proposal) => {
          const votes = await governanceContract.getCurrentVotes(proposal.id);
          return votes.toString();
        })
      );

      setVoteCounts(counts);
    } catch (error) {
      console.error('Error fetching vote counts:', error);
      setError('Failed to fetch vote counts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (proposalId, support) => {
    try {
      const provider = getProvider();
      const signer = getSigner(provider);
      const governanceContract = new Contract('0x9d8dd79f2d4ba9e1c3820d7659a5f5d2fa1c22ef', boneTokenABI, signer);

      const tx = await governanceContract.delegate(support);
      await tx.wait();
      alert('Vote cast successfully!');
      fetchVoteCounts();
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RootContainer maxWidth="lg">
      <Header>
        <TitleTypography variant="h4">Governance Voting</TitleTypography>
      </Header>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        {proposals.map((proposal, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Proposal {index + 1}</Typography>
              <Typography variant="body2" color="textSecondary">{proposal.description}</Typography>
              <Typography variant="body2" color="textSecondary">Vote Count: {voteCounts[index]}</Typography>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" onClick={() => handleVote(proposal.id, true)}>
                  Vote For
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleVote(proposal.id, false)}>
                  Vote Against
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </RootContainer>
  );
};

export default GovernanceVoting;