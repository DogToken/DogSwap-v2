import React from 'react';
import { ButtonBase, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { grey } from '@mui/material/colors';

export default function CoinButton({ coinName, coinAbbr, onClick, logoUrl }) {
  return (
    <ButtonBase
      focusRipple
      sx={{
        width: '100%',
        padding: (theme) => theme.spacing(1),
        borderRadius: (theme) => theme.shape.borderRadius,
        '&:hover, &:focus': {
          backgroundColor: grey[200],
        },
      }}
      onClick={onClick}
      aria-label={`${coinName} (${coinAbbr})`}
    >
      <Grid container direction="column" alignItems="center">
        {logoUrl && (
          <Grid item>
            <img
              src={logoUrl}
              alt={`${coinAbbr} logo`}
              style={{ width: 40, height: 40, borderRadius: '50%' }} // Adjust size and style as needed
            />
          </Grid>
        )}
        <Grid item>
          <Typography variant="h6" component="div">
            {coinAbbr}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            {coinName}
          </Typography>
        </Grid>
      </Grid>
    </ButtonBase>
  );
}

CoinButton.propTypes = {
  coinName: PropTypes.string.isRequired,
  coinAbbr: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  logoUrl: PropTypes.string, // Ensure this prop is defined
};
