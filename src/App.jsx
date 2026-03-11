import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Investors from './pages/Investors';
import Founders from './pages/Founders';
import ImpactStudio from './pages/ImpactStudio';
import Deals from './pages/Deals';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Apply from './pages/Apply';
import InvestorDashboard from './pages/InvestorDashboard';
import InvestorDeals from './pages/InvestorDeals';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/impact-studio" element={<ImpactStudio />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/apply" element={<Apply />} />
            {/* Investor Protected Pages */}
            <Route path="/investor/dashboard" element={<InvestorDashboard />} />
            <Route path="/investor/deals" element={<InvestorDeals />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
