import React from "react";
import { Button, CircularProgress, styled } from "@mui/material";
import { green } from "@mui/material/colors";

const Wrapper = styled('div')({
  margin: 0,
  position: "relative",
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  color: green[500],
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: -12,
  marginLeft: -12,
}));

export default function LoadingButton(props) {
  const { children, loading, valid, success, fail, onClick, ...other } = props;

  return (
    <Wrapper>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !valid}
        type="submit"
        onClick={onClick}
        {...other}
      >
        {children}
      </Button>
      {loading && <Progress size={24} />}
    </Wrapper>
  );
}
