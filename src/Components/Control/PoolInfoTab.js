import React from 'react';
import { 
  Typography, 
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const PoolInfoTab = ({ pools }) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Pools Information</Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pool ID</TableCell>
              <TableCell>LP Token</TableCell>
              <TableCell>Allocation Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.id}</TableCell>
                <TableCell>{pool.lpToken}</TableCell>
                <TableCell>{pool.allocPoint.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PoolInfoTab;