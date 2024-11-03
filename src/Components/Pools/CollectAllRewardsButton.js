import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { 
  Button, 
  CircularProgress, 
  LinearProgress, 
  Typography, 
  Box, 
  Snackbar, 
  Alert, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import masterChefABI from '../../assets/abi/MasterChef.json';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  width: 'auto',
  minWidth: '200px',
}));

const StatusItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  '&:last-child': {
    marginBottom: 0,
  },
}));

const DialogTitleWithClose = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const CollectAllRewardsButton = ({ pools, updateBalances }) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collectionStatus, setCollectionStatus] = useState([]);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [modalOpen, setModalOpen] = useState(false);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleClose = () => {
    if (!isCollecting) {
      setModalOpen(false);
      setCollectionStatus([]);
      setProgress(0);
      setError(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" size={20} />;
      case 'failure':
        return <XCircle color="error" size={20} />;
      case 'pending':
        return <Clock color="warning" size={20} />;
      default:
        return <Clock color="action" size={20} />;
    }
  };

  const updatePoolStatus = useCallback((poolId, status, message = '') => {
    setCollectionStatus(prev => {
      const existingIndex = prev.findIndex(p => p.poolId === poolId);
      const newStatus = { 
        poolId, 
        status, 
        message, 
        timestamp: new Date().toISOString() 
      };
      
      if (existingIndex >= 0) {
        const newStatuses = [...prev];
        newStatuses[existingIndex] = newStatus;
        return newStatuses;
      }
      return [...prev, newStatus];
    });
  }, []);

  const collectAllRewards = async () => {
    setIsCollecting(true);
    setModalOpen(true);
    setCollectionStatus([]);
    setProgress(0);
    setError(null);
    setCurrentAction('Initializing...');

    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const poolsWithRewards = pools.filter(pool => parseFloat(pool.pendingBone) > 0);
      
      if (poolsWithRewards.length === 0) {
        showSnackbar('No rewards available to collect', 'info');
        handleClose();
        return;
      }

      let successCount = 0;

      for (let i = 0; i < poolsWithRewards.length; i++) {
        const pool = poolsWithRewards[i];
        setCurrentAction(`Processing pool ${pool.poolId}...`);
        updatePoolStatus(pool.poolId, 'pending', 'Initiating collection...');

        try {
          const masterChefContract = new ethers.Contract(
            pool.MASTER_CHEF_ADDRESS,
            masterChefABI,
            signer
          );

          const tx = await masterChefContract.deposit(pool.poolId, 0);
          updatePoolStatus(pool.poolId, 'pending', 'Transaction submitted...');
          
          const receipt = await tx.wait(1);

          if (receipt.status === 1) {
            successCount++;
            updatePoolStatus(pool.poolId, 'success', 'Rewards collected successfully');
          } else {
            updatePoolStatus(pool.poolId, 'failure', 'Transaction failed');
          }
        } catch (err) {
          console.error(`Failed to collect rewards for pool ${pool.poolId}:`, err);
          updatePoolStatus(pool.poolId, 'failure', err.message);
        }

        setProgress(Math.round(((i + 1) / poolsWithRewards.length) * 100));
      }

      if (successCount > 0 && updateBalances) {
        setCurrentAction('Updating balances...');
        await updateBalances();
        showSnackbar(`Successfully collected rewards from ${successCount} pools!`, 'success');
      }

    } catch (error) {
      console.error('Error collecting rewards:', error);
      setError(error.message);
      showSnackbar(error.message, 'error');
    } finally {
      setIsCollecting(false);
      setCurrentAction('');
    }
  };

  return (
    <>
      <StyledButton
        variant="contained"
        onClick={collectAllRewards}
        disabled={isCollecting}
        startIcon={isCollecting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isCollecting ? 'Collecting Rewards...' : 'Collect All Rewards'}
      </StyledButton>

      <Dialog
        open={modalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitleWithClose>
          <Typography variant="h6">Collecting Rewards</Typography>
          {!isCollecting && (
            <IconButton onClick={handleClose} size="small">
              <X size={20} />
            </IconButton>
          )}
        </DialogTitleWithClose>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isCollecting && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">
                  Please keep this window open while collecting rewards. It's possible that the tx drops, i'm investigating the issue. Just retry!
                </Typography>
              </Box>
            </Alert>
          )}

          {isCollecting && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {currentAction}
              </Typography>
            </Box>
          )}

          {collectionStatus.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Collection Status
              </Typography>
              {collectionStatus.map((status) => (
                <StatusItem key={status.poolId} elevation={0}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(status.status)}
                    <Typography variant="body1">
                      Pool {status.poolId}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {status.message}
                  </Typography>
                </StatusItem>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={isCollecting}
            variant="outlined"
          >
            {isCollecting ? 'Please Wait...' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CollectAllRewardsButton;