import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "react-loading-skeleton/dist/skeleton.css"
import { SkeletonTheme } from "react-loading-skeleton";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <App />
    </SkeletonTheme>
  </BrowserRouter>
);
