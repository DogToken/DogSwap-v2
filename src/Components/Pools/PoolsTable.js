import React from 'react';
import { TableBody, TableHead, TableRow, Paper, Box, Typography, Avatar, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import StakingPool from './StakingPool';
import { StyledTableContainer, StyledTable, StyledTableCell, LogoContainer, OverlappingAvatar, PoolInfoContainer, StatusChipContainer, StatusChip, FeeChip } from './StyledComponents';

const PoolsTable = ({ pools, handleClick }) => {
  return (
    <StyledTableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            <StyledTableCell>Pool</StyledTableCell>
            <StyledTableCell align="right">Wallet Balance</StyledTableCell>
            <StyledTableCell align="right">Staked Tokens</StyledTableCell>
            <StyledTableCell align="right">Pending Rewards</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pools.map((pool, index) => (
            <TableRow key={index}>
              <StyledTableCell>
                <Box display="flex" alignItems="center">
                  <LogoContainer>
                    <Avatar src={pool.imageTokenA} alt="Token A" sx={{ width: 28, height: 28 }} />
                    <OverlappingAvatar src={pool.imageTokenB} alt="Token B" />
                  </LogoContainer>
                  <PoolInfoContainer>
                    <Typography variant="subtitle2">{pool.title}</Typography>
                    <Typography variant="caption" color="textSecondary">{pool.subTitle}</Typography>
                    <StatusChipContainer>
                      <StatusChip
                        label={pool.isActive ? "Active" : "Inactive"}
                        size="small"
                        isActive={pool.isActive}
                      />
                      <FeeChip
                        label={`${pool.fee}% Fee`}
                        size="small"
                      />
                      {!pool.isActive && (
                        <Tooltip title="This pool is inactive. A 10% fee applies and rewards are turned off.">
                          <IconButton size="small" color="warning">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </StatusChipContainer>
                  </PoolInfoContainer>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="right">{pool.walletBalance}</StyledTableCell>
              <StyledTableCell align="right">{pool.stakedLpTokens}</StyledTableCell>
              <StyledTableCell align="right">{pool.pendingBone} $BONE</StyledTableCell>
              <StyledTableCell align="center">
                <StakingPool
                  pool={pool}
                  onClick={() => handleClick('Button Click', `Staking Pool - ${pool.title}`)}
                />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default PoolsTable;