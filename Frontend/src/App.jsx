import { Routes,Route } from 'react-router-dom';
import React from 'react'
import LandingPage from './components/page/LandingPage';
import EmployeDashboard from './components/page/EmployeDashboard';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/Employe-Dashboard" element={<EmployeDashboard/>}/>

      </Routes>
    </div>
  )
}

export default App
