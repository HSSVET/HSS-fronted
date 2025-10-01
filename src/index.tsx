import React from 'react';
import { createRoot } from 'react-dom/client';
import './shared/styles/index.css';
import './shared/styles/theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);

// Authentication tamamen devre dışı - doğrudan App'i render et
console.log('🚫 Authentication disabled - rendering App directly');
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
