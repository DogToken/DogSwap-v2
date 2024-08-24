import React from 'react';
import { Fab, Grid, InputBase, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// Styled Container
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  minHeight: '80px',
  backgroundColor: grey[50],
  borderRadius: theme.spacing(2),
  border: `1px solid ${grey[300]}`,
  display: 'flex',
  flexDirection: 'column',
}));

// Styled InputBase with custom prop forwarding
const StyledInputBase = styled(InputBase, { 
  shouldForwardProp: (prop) => prop !== 'activeField'
})(({ theme, activeField }) => ({
  padding: theme.spacing(1),
  minHeight: '40px',
  backgroundColor: grey[50],
  borderRadius: theme.spacing(1),
  border: `1px solid ${grey[300]}`,
  flex: 1,  // Allows the input to grow and shrink
  textAlign: 'right',
  color: activeField ? 'inherit' : theme.palette.text.disabled,
}));

// Styled GridContainer
const GridContainer = styled(Grid)({
  height: 'auto', // Allow GridContainer height to be flexible
});

// Styled FabButton
const StyledFabButton = styled(Fab)(({ theme }) => ({
  zIndex: 0,
}));

// CoinField Component
function CoinField({ onClick, symbol, value, onChange, activeField = false }) {
  return (
    <Container>
      <GridContainer container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={3}>
          <StyledFabButton size="small" variant="extended" onClick={onClick}>
            {symbol}
            <ExpandMoreIcon />
          </StyledFabButton>
        </Grid>
        <Grid item xs={9}>
          <StyledInputBase
            value={value}
            onChange={onChange}
            placeholder="0.0"
            disabled={!activeField}
            activeField={activeField}
            inputProps={{ 'aria-label': 'value' }}
          />
        </Grid>
      </GridContainer>
    </Container>
  );
}

CoinField.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  activeField: PropTypes.bool,
};

// RemoveLiquidityField1 Component
export function RemoveLiquidityField1(props) {
  const { onClick, symbol, value, onChange, activeField } = props;

  return (
    <CoinField
      onClick={onClick}
      symbol={symbol}
      value={value}
      onChange={onChange}
      activeField={activeField}
    />
  );
}

RemoveLiquidityField1.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  activeField: PropTypes.bool.isRequired,
};

// RemoveLiquidityField2 Component
export function RemoveLiquidityField2(props) {
  const { onClick, symbol } = props;

  return (
    <Container>
      <GridContainer container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={3}>
          <StyledFabButton size="small" variant="extended" onClick={onClick}>
            {symbol}
            <ExpandMoreIcon />
          </StyledFabButton>
        </Grid>
      </GridContainer>
    </Container>
  );
}

RemoveLiquidityField2.propTypes = {
  onClick: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default CoinField;
