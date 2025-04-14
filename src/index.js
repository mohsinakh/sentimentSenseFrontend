import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import AuthProvider from './context/AuthContext';
import { GoogleOAuthProvider } from "@react-oauth/google"


const clientId = '450924599598-sjr5vitacg7md9jf89h0626k0dlotc36.apps.googleusercontent.com'; // Replace with your actual Google Client ID



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
  <React.StrictMode>
    <BrowserRouter> {/* Wrap both Router and AuthProvider */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  </GoogleOAuthProvider>
);
