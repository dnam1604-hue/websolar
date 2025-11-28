import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="section-container">
          <h1>Về chúng tôi</h1>
          <p className="about-hero-subtitle">
            SolarEV - Kết nối tương lai sạch
          </p>
        </div>
      </section>

      {/* Giới thiệu Section */}
      <section className="about-intro-section">
        <div className="section-container">
          <div className="about-intro-content">
            <h2>Giới thiệu về SolarEV</h2>
            <p>
              SolarEV là giải pháp sạc xe điện thông minh, kết hợp năng lượng mặt trời 
              để tạo ra một hệ thống sạc bền vững và thân thiện với môi trường. 
              Chúng tôi cam kết mang đến trải nghiệm sạc xe điện tốt nhất cho người dùng.
            </p>
            <p>
              Với mạng lưới trạm sạc rộng khắp và công nghệ tiên tiến, SolarEV giúp 
              việc sạc xe điện trở nên dễ dàng, nhanh chóng và tiết kiệm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

