// import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthState from './context/auth/AuthState.jsx';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthState>
      <App />
      <ToastContainer />
    </AuthState>
  </BrowserRouter>
  // </React.StrictMode>
);
