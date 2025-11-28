import React from 'react';
import { useCms } from '../context/CmsContext';
import StationMap from '../components/StationMap';
import NewsCard from '../components/NewsCard';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import SidebarNewsCard from '../components/SidebarNewsCard';
import './Home.css';

const chargingSteps = [
  {
    step: 1,
    title: 'Tìm trạm sạc',
    description: 'Sử dụng ứng dụng hoặc website để tìm trạm sạc gần bạn nhất'
  },
  {
    step: 2,
    title: 'Kết nối cáp sạc',
    description: 'Cắm cáp sạc vào cổng sạc của xe điện, đảm bảo kết nối chắc chắn'
  },
  {
    step: 3,
    title: 'Bắt đầu sạc',
    description: 'Quét mã QR hoặc nhấn nút trên trạm sạc để bắt đầu quá trình sạc'
  },
  {
    step: 4,
    title: 'Theo dõi tiến trình',
    description: 'Theo dõi tiến trình sạc trên ứng dụng và nhận thông báo khi hoàn tất'
  }
];

// Dữ liệu mẫu để xem layout
const mockNews = [
  {
    id: 'mock-1',
    title: 'SolarEV ra mắt trạm sạc mới tại Hà Nội',
    summary: 'Trạm sạc mới với công nghệ sạc nhanh, hỗ trợ đa dạng loại xe điện, đặt tại trung tâm thành phố Hà Nội.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'mock-2',
    title: 'Công nghệ sạc không dây cho xe điện',
    summary: 'SolarEV đang nghiên cứu và phát triển công nghệ sạc không dây tiên tiến, mang lại trải nghiệm sạc tiện lợi hơn.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'mock-3',
    title: 'Hợp tác với các hãng xe điện hàng đầu',
    summary: 'SolarEV ký kết hợp tác chiến lược với nhiều hãng xe điện để mở rộng mạng lưới trạm sạc trên toàn quốc.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'mock-4',
    title: 'Ứng dụng SolarEV cập nhật tính năng mới',
    summary: 'Phiên bản mới của ứng dụng SolarEV với nhiều tính năng hữu ích: đặt lịch sạc, thanh toán online, tích điểm thưởng.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'mock-5',
    title: 'Giải pháp năng lượng mặt trời cho trạm sạc',
    summary: 'SolarEV triển khai hệ thống pin năng lượng mặt trời tại các trạm sạc, giúp giảm chi phí và bảo vệ môi trường.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'mock-6',
    title: 'Chương trình khuyến mãi tháng này',
    summary: 'Giảm giá 20% cho lần sạc đầu tiên và nhiều ưu đãi hấp dẫn khác dành cho khách hàng mới của SolarEV.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  }
];

const Home = () => {
  const { cmsData, loading } = useCms();
  const apiNews = [...(cmsData.news || [])].slice(0, 6).reverse();
  // Sử dụng dữ liệu từ API nếu có, nếu không thì dùng dữ liệu mẫu
  const recentNews = apiNews.length > 0 ? apiNews : mockNews;

  return (
    <div className="home">
      {/* Banner Section - Ảnh xe điện VinFast tại trạm sạc POKIS */}
      <section className="home-banner">
        <div className="banner-image-container">
          <img 
            src="/images/hero-banner.png" 
            alt="Xe điện VinFast đang sạc tại trạm sạc POKIS"
            className="banner-image"
            onError={(e) => {
              // Fallback nếu ảnh chưa được thêm
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="banner-placeholder" style={{ display: 'none' }}>
            <div className="placeholder-content">
              <span>Banner: Xe điện VinFast tại trạm sạc POKIS</span>
              <small>Vui lòng thêm ảnh vào: /public/images/hero-banner.png</small>
            </div>
          </div>
          
          {/* Banner Content Overlay */}
          <div className="banner-overlay">
            <div className="banner-content">
              <h1 className="banner-title">
                <span className="banner-title-line">SolarEV</span>
                <span className="banner-title-line">Hệ Thống Sạc Xe Điện Thông Minh</span>
              </h1>
              <p className="banner-description">
                Giải pháp sạc xe điện hiện đại, tiết kiệm năng lượng mặt trời. Tìm trạm sạc gần nhất, quản lý quá trình sạc dễ dàng, trải nghiệm di chuyển xanh bền vững.
              </p>
              <div className="banner-buttons">
                <a href="/app" className="banner-app-btn app-store">
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </a>
                <a href="/app" className="banner-app-btn google-play-official">
                  <img 
                    src="/images/google-play-logo.png" 
                    alt="Google Play" 
                    className="google-play-logo"
                    onError={(e) => {
                      // Fallback nếu logo chưa có, ẩn đi
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="app-btn-text">
                    <span>GET IT ON</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
            <div className="banner-scroll-indicator">
              <span>Kéo xuống để khám phá</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Hướng dẫn sạc Section */}
      <section className="guide-section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">Hướng dẫn</p>
            <h2>Hướng dẫn sạc xe điện</h2>
            <p className="section-subtitle">
              Quy trình đơn giản để sạc xe điện của bạn một cách an toàn và hiệu quả
            </p>
          </div>
          
          <div className="guide-steps">
            {chargingSteps.map((item) => (
              <div key={item.step} className="guide-step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="guide-cta">
            <a href="/guide" className="btn btn-primary">
              Xem hướng dẫn chi tiết →
            </a>
          </div>
        </div>
      </section>

      {/* Bản đồ trạm sạc Section */}
      <section className="map-section">
        <div className="section-container">
          <StationMap mode="view" />
        </div>
      </section>

      {/* Tin tức Section */}
      <section className="news-section">
        <div className="section-container">
          <div className="section-header-with-action">
            <div className="section-header">
              <p className="eyebrow">Tin tức</p>
              <h2>Tin tức & cập nhật</h2>
              <p className="section-subtitle">
                Cập nhật mới nhất về công nghệ sạc điện, sản phẩm và dịch vụ
              </p>
            </div>
            <a href="/news" className="btn-view-more">
              Xem thêm
            </a>
          </div>

          {loading && apiNews.length === 0 ? (
            <div className="news-loading">Đang tải tin tức...</div>
          ) : (
            <div className="news-page-layout">
              {/* 1 card lớn bên trái, 2 card nhỏ bên phải */}
              <div className="news-main-layout">
                {/* Featured News - 1 card lớn bên trái */}
                {recentNews.length > 0 && (
                  <div className="news-featured-main">
                    <FeaturedNewsCard news={recentNews[0]} />
                  </div>
                )}
                
                {/* Sidebar News - các card nhỏ bên phải */}
                {recentNews.length > 1 && (
                  <div className="news-sidebar">
                    {recentNews.slice(1, 3).map((item) => (
                      <SidebarNewsCard key={item._id || item.id} news={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Chương trình khuyến mãi */}
              <div className="promotion-news-section">
                <div className="promotion-news-grid">
                  <NewsCard 
                    news={{
                      id: 'promo-1',
                      title: 'Chương trình khuyến mãi tháng này',
                      summary: 'Giảm giá 20% cho lần sạc đầu tiên và nhiều ưu đãi hấp dẫn khác dành cho khách hàng mới của SolarEV.',
                      image: '',
                      content: '',
                      link: '',
                      createdAt: new Date()
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
