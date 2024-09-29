import React from 'react';
import { ethers } from 'ethers';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, IconButton
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import InfoCard from './InfoCard';

const RecentTransactions = ({ transactions, isLoading, handleCopy }) => (
  <InfoCard
    title="Recent Transactions"
    icon={<ReceiptIcon />}
    isLoading={isLoading}
    content={
      transactions.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
          <Table stickyHeader>
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
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">{`${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}</Typography>
                      <IconButton size="small" onClick={() => handleCopy(tx.hash)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{ethers.utils.formatEther(tx.value)} MINTME</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">{tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : 'Contract'}</Typography>
                      {tx.to && (
                        <IconButton size="small" onClick={() => handleCopy(tx.to)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No recent transactions found.</Typography>
      )
    }
  />
);

export default RecentTransactions;