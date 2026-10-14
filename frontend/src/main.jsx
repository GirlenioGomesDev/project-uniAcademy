import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import './styles.css';
import '@fontsource-variable/manrope';
import '@fontsource-variable/sora';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
