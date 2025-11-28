import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Solar<span style={{ color: '#00A859' }}>EV</span>
            </h3>
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


