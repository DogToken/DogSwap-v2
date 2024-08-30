import React from "react";
import ReactGA from 'react-ga4'; // Import ReactGA for GA4 tracking
import { Container, Grid, Paper, Typography, styled } from "@mui/material";
import SwitchButton from "../Components/Liquidity/SwitchButton";
import LiquidityDeployer from "../Components/Liquidity/LiquidityDeployer";
import LiquidityRemover from "../Components/Liquidity/RemoveLiquidity";

// Styled components
const PaperContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: "auto",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const ContentContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Liquidity = (props) => {
  const [deploy, setDeploy] = React.useState(true);

  const deployOrRemove = (deploy) => {
    return deploy ? <LiquidityDeployer network={props.network}/> : <LiquidityRemover network={props.network}/>;
  };

  const handleSwitch = (action) => {
    ReactGA.event({
      category: 'Liquidity Management',
      action: 'Switch Action',
      label: action,
    });
  };

  return (
    <Container maxWidth="md">
      <PaperContainer elevation={3}>
        <Title variant="h4">
          Liquidity Management
        </Title>
        <Grid container justifyContent="center" style={{ marginBottom: "24px" }}>
          <SwitchButton setDeploy={setDeploy} onSwitch={(deploy) => handleSwitch(deploy ? 'Deploy' : 'Remove')} />
        </Grid>

        <ContentContainer>
          {deployOrRemove(deploy)}
        </ContentContainer>
      </PaperContainer>
    </Container>
  );
}

export default Liquidity;
