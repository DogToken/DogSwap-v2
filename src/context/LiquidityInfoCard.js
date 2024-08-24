import React from 'react';
import { Paper, Typography, Grid, Box, Chip, styled } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WaterIcon from '@mui/icons-material/Water';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Added icon for Pool Tokens

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px', 
  margin: '0 auto',  
}));

const InfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  textAlign: 'center',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  marginTop: theme.spacing(1),
  fontSize: '0.85rem',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const LiquidityInfoCard = ({ balances, reserves, liquidityTokens, poolTokensReceived }) => {
  return (
    <StyledPaper elevation={3}>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={3}>
          <InfoSection>
            <IconWrapper>
              <AccountBalanceWalletIcon fontSize="medium" />
            </IconWrapper>
            <Typography variant="body1" gutterBottom>Your Balances</Typography>
            <StyledChip label={balances[0]} />
            <StyledChip label={balances[1]} />
          </InfoSection>
        </Grid>

        <Grid item xs={12} sm={3}>
          <InfoSection>
            <IconWrapper>
              <WaterIcon fontSize="medium" />
            </IconWrapper>
            <Typography variant="body1" gutterBottom>Reserves</Typography>
            <StyledChip label={reserves[0]} />
            <StyledChip label={reserves[1]} />
          </InfoSection>
        </Grid>

        <Grid item xs={12} sm={3}>
          <InfoSection>
            <IconWrapper>
              <LocalDrinkIcon fontSize="medium" />
            </IconWrapper>
            <Typography variant="body1" gutterBottom>Liquidity Tokens</Typography>
            <StyledChip label={liquidityTokens} />
          </InfoSection>
        </Grid>

        <Grid item xs={12} sm={3}>
          <InfoSection>
            <IconWrapper>
              <ReceiptIcon fontSize="medium" /> {/* New icon for Pool Tokens */}
            </IconWrapper>
            <Typography variant="body1" gutterBottom>Estimated Pool Tokens</Typography>
            <StyledChip label={poolTokensReceived} />
          </InfoSection>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default LiquidityInfoCard;
