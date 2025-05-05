import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Box } from '@mui/material';

function GoogleLoginButton({ onSuccess, onError }) {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      onSuccess(tokenResponse);
    },
    onError: errorResponse => {
      onError(errorResponse);
    },
  });

  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      onClick={() => login()}
      startIcon={
        <Box
          component="img"
          src="/7123025_logo_google_g_icon.png"
          alt="Google logo"
          sx={{ width: 20, height: 20 }}
        />
      }
    >
      Continue with Google
    </Button>
  );
}

export default GoogleLoginButton;
