import { styled } from '@mui/system';
import { Container, Box, Typography, TableContainer, Table, TableCell, Avatar, Chip, Tabs } from '@mui/material';

export const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

export const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontSize: '2rem',
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  background: theme.palette.background.paper,
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  '& thead th': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '0.85rem',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const OverlappingAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  marginLeft: -8,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export const StatusChip = styled(Chip)(({ theme, isActive }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: isActive ? theme.palette.success.light : theme.palette.error.light,
  color: isActive ? theme.palette.success.contrastText : theme.palette.error.contrastText,
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
}));

export const PoolInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: theme.spacing(2),
}));

export const StatusChipContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FeeChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
}));