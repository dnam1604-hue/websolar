import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import {
  AppPage,
  StationsPage,
  GuidePage,
  PackagesPage,
  FaqPage,
  ConsultationPage,
} from './pages/user';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewsDetail from './pages/NewsDetail';
import News from './pages/News';
import About from './pages/About';
import { CmsProvider } from './context/CmsContext';
import './App.css';

function MainContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <main className={`main-content ${isAdminPage ? 'admin-full-width' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/stations" element={<StationsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/products/:category" element={<PackagesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <CmsProvider>
      <Router>
        <div className="App">
          <Header />
          <MainContent />
          <Footer />
        </div>
      </Router>
    </CmsProvider>
  );
}

export default App;
