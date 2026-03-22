window.SERVER_CONFIG = {
  IO_URL: import.meta.env.VITE_IO_SERVER_ADDRESS
};

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from '../store/store.js';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<Provider store={store}><App /></Provider>)

