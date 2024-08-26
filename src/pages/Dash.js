import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Create a default theme
const defaultTheme = createTheme();

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StyledChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: 400,
}));

export default function Dashboard() {
  // Example data for the chart (you'll replace this with your own data)
  const data = [
    { name: 'January', value: 65 },
    { name: 'February', value: 59 },
    { name: 'March', value: 80 },
    { name: 'April', value: 81 },
    { name: 'May', value: 56 },
    { name: 'June', value: 55 },
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <RootContainer maxWidth="lg">
        <TitleTypography variant="h4">Analytics</TitleTypography>

        <Grid container spacing={3}>
          {/* Example Chart */}
          <Grid item xs={12}>
            <StyledChartContainer>
              <Typography variant="h6" gutterBottom>
                Bone Price History
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </StyledChartContainer>
          </Grid>

          {/* Placeholder for other content */}
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Placeholder Content
              </Typography>
              <Typography>
                You can add your own content here, like data tables, graphs, or any other information you want to display.
              </Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </RootContainer>
    </ThemeProvider>
  );
}
