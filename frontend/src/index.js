import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="66944987642-25namui746hqqlk6ecor1539opq65k1p.apps.googleusercontent.com">
    <AppWrapper />
  </GoogleOAuthProvider>
);