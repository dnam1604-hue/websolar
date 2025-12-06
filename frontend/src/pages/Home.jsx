import React, { useState, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import StationMap from '../components/StationMap';
import NewsCard from '../components/NewsCard';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import SidebarNewsCard from '../components/SidebarNewsCard';
import {
  MdEvStation,
  MdBolt,
  MdPayment,
  MdPhoneAndroid,
  MdSolarPower,
  MdSecurity,
  MdSpeed,
  MdCloudQueue,
  MdChevronLeft,
  MdChevronRight,
  MdPeople,
  MdLocalGasStation,
  MdTrendingUp
} from 'react-icons/md';
import './Home.css';

// Gallery Carousel Component
const GalleryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const images = [
    {
      src: 'https://solarev.vn/wp-content/uploads/2025/03/chargingstation-2.png',
      alt: 'Trạm sạc SolarEV',
      objectFit: 'cover'
    },
    {
      src: 'https://solarev.vn/wp-content/uploads/2025/03/chargingstation-3.png',
      alt: 'Trạm sạc SolarEV',
      objectFit: 'cover'
    },
    {
      src: 'https://solarev.vn/wp-content/uploads/2025/03/chargingstation-6.png',
      alt: 'Trạm sạc SolarEV',
      objectFit: 'cover'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Tự động chuyển sau 5 giây

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="gallery-carousel">
      <div className="gallery-carousel-container">
        <button className="gallery-nav-btn gallery-nav-prev" onClick={prevSlide} aria-label="Ảnh trước">
          <MdChevronLeft size={32} />
        </button>
        <div 
          className="gallery-slides"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`gallery-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                style={{ objectFit: image.objectFit || 'cover' }}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        <button className="gallery-nav-btn gallery-nav-next" onClick={nextSlide} aria-label="Ảnh sau">
          <MdChevronRight size={32} />
        </button>
      </div>
      <div className="gallery-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Chuyển đến ảnh ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

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
    description: 'Quét mã QR, quẹt thẻ SolarEV hoặc nhấn nút trên trạm sạc để bắt đầu quá trình sạc'
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
                <a 
                  href="https://apps.apple.com/vn/app/solarev-tr%E1%BA%A1m-s%E1%BA%A1c-xe-%C4%91i%E1%BB%87n/id6470471363?l=vi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="banner-app-btn app-store-btn"
                >
                  <img 
                    src="/images/app-store-button.png" 
                    alt="Download on the App Store" 
                    className="app-store-button-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </a>
                <a 
                  href="https://play.google.com/store/search?q=solarev&c=apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="banner-app-btn google-play-btn"
                >
                  <img 
                    src="/images/google-play-button.png" 
                    alt="Get it on Google Play" 
                    className="google-play-button-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
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

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="section-container">
          <div className="statistics-header">
            <h2 className="statistics-commitment">
              Giải pháp sạc xe điện thông minh<br />
              cho tương lai bền vững
            </h2>
          </div>
            <div className="statistics-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Trụ sạc</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200,000+</div>
              <div className="stat-label">Số KWh đã sạc</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">6,200+</div>
              <div className="stat-label">Khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo đối tác Section */}
      <section className="partners-section">
        <div className="partners-container">
          <div className="partners-slider">
              {[
                { name: 'VinFast', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-vinfast-1.png' },
                { name: 'BYD', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-BYD-2048x512.png' },
                { name: 'Suzuki', url: 'https://solarev.vn/wp-content/uploads/2025/03/suzukilogo.png' },
                { name: 'Hyundai', url: 'https://solarev.vn/wp-content/uploads/2025/03/Hyundai_Motor_Company_logo.svg.png' },
                { name: 'Foxconn', url: 'https://solarev.vn/wp-content/uploads/2025/03/Foxconn_logo.svg-2048x295.png' },
                { name: 'SaigonTourist', url: 'https://solarev.vn/wp-content/uploads/2025/03/Logo-SaigonTourist.webp' },
                { name: 'SaigonBus', url: 'https://solarev.vn/wp-content/uploads/2025/03/SaigonBus_logo.png' },
                { name: 'SCTV', url: 'https://solarev.vn/wp-content/uploads/2025/03/SCTV_logo_Vietnam.svg' },
                { name: 'Atlas Copco', url: 'https://solarev.vn/wp-content/uploads/2025/03/Atlas-Copco-Logo.svg.png' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/unnamed.png' },
                { name: 'SAIGON PETRO', url: 'https://solarev.vn/wp-content/uploads/2025/03/SAIGON_PETRO.jpg' },
                { name: 'Gamuda Land', url: 'https://solarev.vn/wp-content/uploads/2025/03/cropped-cropped-logo-gamuda-land-by-salereal-700x200.png' },
                { name: 'EVN', url: 'https://solarev.vn/wp-content/uploads/2025/03/14042023_LogoEVN_Ngang_FULL.jpg' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images.png' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images-2.png' },
                { name: 'Ford', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-ford-inkythuatso-01-15-14-01-42-700x495.jpg' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images-3.png' },
                { name: 'Mercedes', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-mercedes-1.webp' }
              ].concat([
                { name: 'VinFast', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-vinfast-1.png' },
                { name: 'BYD', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-BYD-2048x512.png' },
                { name: 'Suzuki', url: 'https://solarev.vn/wp-content/uploads/2025/03/suzukilogo.png' },
                { name: 'Hyundai', url: 'https://solarev.vn/wp-content/uploads/2025/03/Hyundai_Motor_Company_logo.svg.png' },
                { name: 'Foxconn', url: 'https://solarev.vn/wp-content/uploads/2025/03/Foxconn_logo.svg-2048x295.png' },
                { name: 'SaigonTourist', url: 'https://solarev.vn/wp-content/uploads/2025/03/Logo-SaigonTourist.webp' },
                { name: 'SaigonBus', url: 'https://solarev.vn/wp-content/uploads/2025/03/SaigonBus_logo.png' },
                { name: 'SCTV', url: 'https://solarev.vn/wp-content/uploads/2025/03/SCTV_logo_Vietnam.svg' },
                { name: 'Atlas Copco', url: 'https://solarev.vn/wp-content/uploads/2025/03/Atlas-Copco-Logo.svg.png' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/unnamed.png' },
                { name: 'SAIGON PETRO', url: 'https://solarev.vn/wp-content/uploads/2025/03/SAIGON_PETRO.jpg' },
                { name: 'Gamuda Land', url: 'https://solarev.vn/wp-content/uploads/2025/03/cropped-cropped-logo-gamuda-land-by-salereal-700x200.png' },
                { name: 'EVN', url: 'https://solarev.vn/wp-content/uploads/2025/03/14042023_LogoEVN_Ngang_FULL.jpg' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images.png' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images-2.png' },
                { name: 'Ford', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-ford-inkythuatso-01-15-14-01-42-700x495.jpg' },
                { name: 'Partner', url: 'https://solarev.vn/wp-content/uploads/2025/03/images-3.png' },
                { name: 'Mercedes', url: 'https://solarev.vn/wp-content/uploads/2025/03/logo-mercedes-1.webp' }
              ]).map((partner, index) => (
                <div key={index} className="partner-logo-wrapper">
                  <img
                    src={partner.url}
                    alt={`Logo ${partner.name}`}
                    className="partner-logo"
                    onError={(e) => {
                      console.error(`Failed to load logo for ${partner.name}:`, partner.url);
                      e.target.style.display = 'none';
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Hướng dẫn sạc Section */}
      <section className="guide-section">
        <div className="section-container">
          <div className="section-header-with-action">
          <div className="section-header">
            <p className="eyebrow">Hướng Dẫn</p>
            <h2>Hướng dẫn sạc xe điện</h2>
            <p className="section-subtitle">
              Quy trình đơn giản để sạc xe điện của bạn một cách an toàn và hiệu quả
            </p>
            </div>
            <a href="/guide" className="btn-view-more">
              Chi tiết
            </a>
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
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">Tính Năng</p>
            <h2>Tính năng nổi bật</h2>
            <p className="section-subtitle">
              Những lợi ích khi sử dụng dịch vụ SolarEV
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MdEvStation size={40} />
              </div>
              <h3>Tìm trạm sạc dễ dàng</h3>
              <p>Tìm kiếm trạm sạc gần nhất với bản đồ tương tác, thông tin chi tiết về vị trí, trạng thái và giá cả</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdBolt size={40} />
              </div>
              <h3>Sạc nhanh và an toàn</h3>
              <p>Công nghệ sạc nhanh DC, hỗ trợ đa dạng loại xe điện, đảm bảo an toàn và hiệu quả tối đa</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdPayment size={40} />
              </div>
              <h3>Thanh toán tiện lợi</h3>
              <p>Thanh toán đa dạng: QR code, thẻ SolarEV, hoặc ứng dụng di động. Nhanh chóng và bảo mật</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdPhoneAndroid size={40} />
              </div>
              <h3>Platform đa nền tảng</h3>
              <p>Ứng dụng di động iOS và Android, website responsive, quản lý mọi lúc mọi nơi</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdSolarPower size={40} />
              </div>
              <h3>Năng lượng mặt trời</h3>
              <p>Sử dụng năng lượng mặt trời sạch, giảm chi phí và bảo vệ môi trường bền vững</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdSpeed size={40} />
              </div>
              <h3>Theo dõi thời gian thực</h3>
              <p>Giám sát tiến trình sạc, thời gian còn lại, và nhận thông báo khi hoàn tất qua ứng dụng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdSecurity size={40} />
              </div>
              <h3>Bảo mật thông tin</h3>
              <p>Hệ thống bảo mật cao, mã hóa dữ liệu, bảo vệ thông tin cá nhân và giao dịch của bạn</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MdCloudQueue size={40} />
              </div>
              <h3>Đồng bộ đám mây</h3>
              <p>Dữ liệu được đồng bộ đám mây, truy cập lịch sử sạc, hóa đơn và điểm tích lũy mọi lúc</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hình ảnh trạm sạc Section */}
      <section className="station-gallery-section">
        <div className="section-container">
          <div className="section-header">
            <p className="eyebrow">Hình Ảnh</p>
            <h2>Một số hình ảnh trạm sạc của SolarEV</h2>
            <p className="section-subtitle">
              Trạm sạc hiện đại với công nghệ năng lượng mặt trời, phân bố rộng khắp cả nước
            </p>
          </div>
          <GalleryCarousel />
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
              <p className="eyebrow">Tin Tức</p>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu hành trình xanh?</h2>
            <p>Tải ứng dụng SolarEV ngay hôm nay và trải nghiệm dịch vụ sạc xe điện thông minh</p>
            <div className="cta-buttons">
              <a href="/app" className="btn btn-cta-primary btn-large">
                Tải ứng dụng
              </a>
              <a href="/consultation" className="btn btn-cta-secondary btn-large">
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
