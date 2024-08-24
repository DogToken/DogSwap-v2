import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, styled } from "@mui/material";

// Styled DialogContainer to apply custom styles
const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
  },
}));

// Functional component for the WrongNetwork dialog
export default function WrongNetwork(props) {
  const { open, onClose } = props; // Destructure props to get open state and onClose function

  return (
    <DialogContainer
      open={open}
      onClose={onClose} // Close dialog when clicking outside or on the close button
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Unsupported Network
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          It looks like you're connected to a network that is not supported by this application. Please switch to a supported network to continue.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </DialogContainer>
  );
}
