import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import type { NextPage } from 'next';
import ColorModeToolbar from '../src/components/ColorModeToolbar';

const Index: NextPage = () => {
  return (
    <>
      <ColorModeToolbar>
        <Typography variant="h6" noWrap>
            Home
        </Typography>
      </ColorModeToolbar>
      <Container maxWidth="lg">
        <Box sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            hello
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Index;