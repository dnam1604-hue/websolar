import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="section-container">
          <h1>Về chúng tôi</h1>
        </div>
      </section>

      {/* Giới thiệu Section */}
      <section className="about-intro-section">
        <div className="section-container">
          <div className="about-intro-content">
            {/* Nội dung sẽ được cập nhật sau */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

