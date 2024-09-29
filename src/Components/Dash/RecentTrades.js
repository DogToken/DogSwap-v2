import React from 'react';
import { ethers } from 'ethers';
import {
  Typography, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import InfoCard from './InfoCard';

const RecentTrades = ({ routerTransactions, isLoading, handleCopy }) => (
  <InfoCard
    title="Recent Trades"
    icon={<ReceiptIcon />}
    isLoading={isLoading}
    content={
      routerTransactions.length > 0 ? (
        <List>
          {routerTransactions.map((tx, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    Hash: {`${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Value: {ethers.utils.formatEther(tx.value)} MINTME
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.primary">
                      From: {tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : 'Unknown'}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(tx.hash)}>
                  <ContentCopyIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No recent trades found.</Typography>
      )
    }
  />
);

export default RecentTrades;