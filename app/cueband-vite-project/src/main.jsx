/**
 * 
 * Main
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Rendering the main component App inside BrowserRouter with strict mode enabled
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/cueband/app">
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)


