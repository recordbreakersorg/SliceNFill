import React from 'react'
import {createRoot} from 'react-dom/client'
import './w3pro.css'
import './w3-theme-black.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
