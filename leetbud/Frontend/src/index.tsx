import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

/**
 * Entry point for the React application. This file sets up the root rendering
 * mechanism using ReactDOM and wraps the App component with BrowserRouter
 * for SPA routing capabilities. Also includes setup for reporting web vitals.
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Web vitals tool to measure the performance of the app
// It can log results to the console or send them to an analytics endpoint
reportWebVitals();
