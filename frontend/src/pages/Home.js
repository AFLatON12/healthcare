import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import NavigationBar from '../components/NavigationBar';

function Home() {
  return (
    <>
      <NavigationBar isLoggedIn={false} />
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Welcome to the Healthcare System
          </Typography>
          <Typography variant="h6">
            Please sign in or sign up to continue.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default Home;
