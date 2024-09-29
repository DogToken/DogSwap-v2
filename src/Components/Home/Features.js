import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'User-Friendly Environment',
    description:
      'We prioritize intuitive design and seamless experiences for all users, ensuring that trading is accessible to everyone.',
    imageLight: '/images/ui/ui.png',
    imageDark: '/images/ui/ui-dark.png',
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Community Engagement',
    description:
      'We encourage active participation, allowing users to shape the platform future through feedback and governance.',
    imageLight: '/images/ui/mintme.png',
    imageDark: '/images/ui/mintme-dark.png',
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'Transparency',
    description:
      'By maintaining open communication and clear processes, we build trust within our community, enhancing overall trading confidence.',
    imageLight: '/images/ui/github.png',
    imageDark: '/images/ui/github-dark.png',
  },
];

const Chip = styled(MuiChip)(({ theme }) => ({
  '&.Mui-selected': {
    background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
    color: 'white',
  },
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) return null;

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={{
            m: 'auto',
            width: 400,
            height: 400,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: (theme) =>
              theme.palette.mode === 'dark'
                ? `url(${items[selectedItemIndex].imageDark})`
                : `url(${items[selectedItemIndex].imageLight})`,
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    icon: PropTypes.element,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export { MobileLayout };

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Box sx={{ backgroundColor: 'white', width: '100vw', py: { xs: 6, sm: 2 } }}>
      <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
        <Box sx={{ width: { sm: '100%', md: '60%' } }}>
          <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
            DogSwap Features
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}>
            We are continually striving to improve and make the MintMe community a safe space to
            trade and explore innovative DeFi solutions, including the BONE token. Our focus is on
            building a user-friendly environment, fostering community engagement, and ensuring
            transparency in all transactions.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, gap: 2 }}>
          <div>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                gap: 2,
                height: '100%',
              }}
            >
              {items.map(({ icon, title, description }, index) => (
                <Box
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={(theme) => ({
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    ...(selectedItemIndex === index && {
                      backgroundColor: theme.palette.action.selected,
                    }),
                  })}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      textAlign: 'left',
                      textTransform: 'none',
                      color: selectedItemIndex === index ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {icon}
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2">{description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <MobileLayout
              selectedItemIndex={selectedItemIndex}
              handleItemClick={handleItemClick}
              selectedFeature={selectedFeature}
            />
          </div>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: { xs: '100%', md: '70%' },
              height: '500px',
            }}
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                width: '100%',
                display: { xs: 'none', sm: 'flex' },
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  m: 'auto',
                  width: 420,
                  height: 500,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `url(${items[selectedItemIndex].imageDark})`
                      : `url(${items[selectedItemIndex].imageLight})`,
                }}
              />
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
