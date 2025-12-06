import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dropdown from './Dropdown';
import {
  MdPhoneAndroid,
  MdEvStation,
  MdMenuBook,
  MdLocalOffer,
  MdHelp,
  MdHeadsetMic,
  MdBolt,
  MdBatteryChargingFull,
  MdCable,
  MdBusiness,
  MdDirectionsCar,
  MdStar,
  MdInfo,
  MdQuestionAnswer,
  MdArticle,
  MdPhotoLibrary,
  MdDescription,
  MdSearch,
  MdLanguage
} from 'react-icons/md';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isActiveSection = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  // Menu data
  const userMenuItems = [
    { label: 'Tải ứng dụng SolarEV', path: '/app', icon: <MdPhoneAndroid size={20} /> },
    { label: 'Tìm trạm sạc', path: '/stations', icon: <MdEvStation size={20} /> },
    { label: 'Hướng dẫn sạc', path: '/guide', icon: <MdMenuBook size={20} /> },
    { label: 'Bảng giá và dịch vụ sạc', path: '/packages', icon: <MdLocalOffer size={20} /> },
    { label: 'FAQ', path: '/faq', icon: <MdHelp size={20} /> },
    { label: 'Tư vấn lắp đặt và liên hệ', path: '/consultation', icon: <MdHeadsetMic size={20} /> },
  ];

  const purchaseMenuItems = [
    { label: 'Bộ sạc DC', path: '/products/dc', icon: <MdBolt size={20} /> },
    { label: 'Bộ sạc AC', path: '/products/ac', icon: <MdBatteryChargingFull size={20} /> },
    { label: 'Bộ sạc di động, phụ kiện', path: '/products/portable', icon: <MdCable size={20} /> },
  ];

  const partnerMenuItems = [
    { label: 'Mở trạm sạc công cộng', path: '/partner/stations', icon: <MdBusiness size={20} /> },
    { label: 'Giải pháp cho hãng xe & nhà phân phối', path: '/partner/solutions', icon: <MdDirectionsCar size={20} /> },
    { label: 'Lý do chọn SolarEV', path: '/partner/why', icon: <MdStar size={20} /> },
  ];

  const aboutMenuItems = [
    { label: 'Về SolarEV', path: '/about', icon: <MdInfo size={20} /> },
    { label: 'FAQ', path: '/faq', icon: <MdQuestionAnswer size={20} /> },
    { label: 'Tin tức', path: '/news', icon: <MdArticle size={20} /> },
    { label: 'Thư viện hình ảnh', path: '/gallery', icon: <MdPhotoLibrary size={20} /> },
    { label: 'Điều khoản và chính sách', path: '/terms', icon: <MdDescription size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          {!logoError && (
            <img 
              src="/images/solarev-logo.png" 
              alt="SolarEV Logo" 
              className="logo-image"
              onError={() => setLogoError(true)}
            />
          )}
          <h1 className="logo-text">
            <span style={{ color: '#1E88E5' }}>Solar</span>
            <span style={{ color: '#E53935' }}>EV</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Dropdown
            title="Người dùng"
            items={userMenuItems}
            isActive={isActiveSection(['/app', '/stations', '/guide', '/packages', '/faq', '/consultation'])}
          />
          <Dropdown
            title="Sản phẩm"
            items={purchaseMenuItems}
            isActive={isActiveSection(['/products'])}
          />
          <Dropdown
            title="Hợp tác"
            items={partnerMenuItems}
            isActive={isActiveSection(['/partner'])}
          />
          <Dropdown
            title="Về chúng tôi"
            items={aboutMenuItems}
            isActive={isActiveSection(['/about', '/faq', '/news', '/gallery', '/terms'])}
          />
        </nav>

        {/* Icons Section */}
        <div className="header-icons">
          <button className="icon-btn" aria-label="Search">
            <MdSearch size={20} />
          </button>
          <button className="icon-btn" aria-label="Language">
            <MdLanguage size={20} />
            <span className="icon-text">VI</span>
          </button>
          <Link to="/app" className="btn btn-primary btn-header">
            Tải ứng dụng
          </Link>
          <Link to="/stations" className="btn btn-primary btn-header">
            Tìm trạm sạc
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-content">
            <Dropdown
              title="Người dùng"
              items={userMenuItems}
              isActive={isActiveSection(['/app', '/stations', '/guide', '/packages', '/faq', '/consultation'])}
            />
            <Dropdown
              title="Sản phẩm"
              items={purchaseMenuItems}
              isActive={isActiveSection(['/products'])}
            />
            <Dropdown
              title="Hợp tác"
              items={partnerMenuItems}
              isActive={isActiveSection(['/partner'])}
            />
            <Dropdown
              title="Về chúng tôi"
              items={aboutMenuItems}
              isActive={isActiveSection(['/about', '/faq', '/news', '/gallery', '/terms'])}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
