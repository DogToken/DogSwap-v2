import React from "react";
import { ButtonGroup, Button, styled } from "@mui/material";

// Style the ButtonGroup
const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  boxShadow: 'none',
  borderRadius: theme.spacing(1),
  '& .MuiButton-root': {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0 2px 4px ${theme.palette.grey[300]}`,
    margin: theme.spacing(0, 0.5), // Add margin between buttons
  },
}));

// Style the Button with conditional styling based on `active` prop
const StyledButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'active' })(
  ({ theme, active }) => ({
    backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
    color: active ? theme.palette.common.white : theme.palette.text.primary,
    border: `1px solid ${active ? theme.palette.primary.main : theme.palette.grey[300]}`,
    borderRadius: theme.spacing(2),
    boxShadow: active ? `0 4px 8px ${theme.palette.primary.dark}` : 'none',
    '&:hover': {
      backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[400],
      boxShadow: active ? `0 6px 12px ${theme.palette.primary.dark}` : `0 2px 4px ${theme.palette.grey[500]}`,
    },
  })
);

export default function SwitchButton(props) {
  const { setDeploy } = props;
  const [activeButton, setActiveButton] = React.useState('deploy');

  // Handle button click
  const handleButtonClick = (button) => {
    setActiveButton(button);
    setDeploy(button === 'deploy');
  };

  return (
    <StyledButtonGroup size="large" variant="contained" aria-label="switch buttons">
      <StyledButton
        active={activeButton === 'deploy'} // This will only be used for styling
        onClick={() => handleButtonClick('deploy')}
      >
        Deploy Liquidity
      </StyledButton>
      <StyledButton
        active={activeButton === 'remove'} // This will only be used for styling
        onClick={() => handleButtonClick('remove')}
      >
        Remove Liquidity
      </StyledButton>
    </StyledButtonGroup>
  );
}
