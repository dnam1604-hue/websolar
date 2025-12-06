import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-container">
              {!logoError && (
                <img 
                  src="/images/solarev-logo.png" 
                  alt="SolarEV Logo" 
                  className="footer-logo"
                  onError={() => setLogoError(true)}
                />
              )}
              <h3 className="footer-logo-text">
                <span style={{ color: '#1E88E5' }}>Solar</span>
                <span style={{ color: '#E53935' }}>EV</span>
              </h3>
            </div>
            <p>Kết nối tương lai sạch</p>
            <p>Giải pháp năng lượng mặt trời và xe điện cho tương lai bền vững.</p>
          </div>
          <div className="footer-section">
            <h3>Về chúng tôi</h3>
            <a href="/about">Giới thiệu</a>
            <a href="/contact">Liên hệ</a>
            <a href="/news">Tin tức</a>
          </div>
          <div className="footer-section">
            <h3>Dịch vụ</h3>
            <a href="/services">Dịch vụ sạc</a>
            <a href="/products">Sản phẩm</a>
            <a href="/support">Hỗ trợ</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SolarEV. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


