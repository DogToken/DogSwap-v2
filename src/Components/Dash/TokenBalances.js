import React from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, IconButton, Tooltip,
  Link
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import InfoCard from './InfoCard';
import TokenIcon from '@mui/icons-material/Token';

const TokenBalances = ({ tokens, isLoading, handleCopy }) => (
  <InfoCard
    title="Token Balances"
    icon={<TokenIcon />}
    isLoading={isLoading}
    content={
      tokens.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Contract Address</TableCell>
                <TableCell>Project Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.map((token, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img src={token.image} alt={token.symbol} style={{ width: 24, height: 24, marginRight: 8 }} />
                      {token.symbol}
                    </Box>
                  </TableCell>
                  <TableCell>{token.balance}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">{`${token.address.slice(0, 6)}...${token.address.slice(-4)}`}</Typography>
                      <IconButton size="small" onClick={() => handleCopy(token.address)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Link href={token.homepage} target="_blank" rel="noopener noreferrer">
                        {token.homepage}
                      </Link>
                      <Tooltip title={token.info} arrow>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No token balances found.</Typography>
      )
    }
  />
);

export default TokenBalances;