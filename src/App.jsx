import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Investors from './pages/Investors';
import Founders from './pages/Founders';
import Studio from './pages/Studio';
import Deals from './pages/Deals';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DealSubmit from './pages/DealSubmit';
import InvestorDashboard from './pages/InvestorDashboard';
import InvestorDeals from './pages/InvestorDeals';
import InvestorProfile from './pages/InvestorProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Pricing from './pages/Pricing';
import FounderLogin from './pages/FounderLogin';
import FounderDashboard from './pages/FounderDashboard';
import VerifyLink from './pages/VerifyLink';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/verify" element={<VerifyLink />} />
            {/* Founder Routes */}
            <Route path="/submit-deal" element={<DealSubmit />} />
            <Route path="/founder/login" element={<FounderLogin />} />
            <Route path="/founder/signup" element={<FounderLogin />} />
            <Route path="/founder/dashboard" element={<FounderDashboard />} />
            {/* Investor Protected */}
            <Route path="/investor/dashboard" element={<InvestorDashboard />} />
            <Route path="/investor/deals" element={<InvestorDeals />} />
            <Route path="/investor/profile" element={<InvestorProfile />} />
            {/* Admin Protected */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
