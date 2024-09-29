import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

const InfoCard = ({ title, icon, content, isLoading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
      </Box>
      {isLoading ? <Skeleton variant="rectangular" width="100%" height={100} /> : content}
    </CardContent>
  </Card>
);

export default InfoCard;