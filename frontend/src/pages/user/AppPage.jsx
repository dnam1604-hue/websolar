import React from 'react';
import './AppPage.css';

const AppPage = () => {
  return (
    <div className="app-page">
      <div className="app-page-container">
        <h1 className="app-page-title">Tải ứng dụng SolarEV</h1>
        <p className="app-page-subtitle">
          Hướng dẫn tải và đăng ký ứng dụng SOLAREV Trạm sạc xe điện
        </p>

        {/* Hình ảnh hướng dẫn */}
        <div className="app-guide-image-section">
          <img 
            src="/images/app-download-guide.png" 
            alt="Hướng dẫn tải ứng dụng SolarEV"
            className="app-guide-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Video hướng dẫn và QR Code */}
        <div className="app-media-section">
          {/* Bên trái: Text và QR Codes */}
          <div className="app-left-section">
            <h1 className="app-main-heading">
              Tham gia mạng lưới sạc xe điện mở lớn nhất Việt Nam với ỨNG DỤNG{' '}
              <span className="highlight-solar">SOLAR</span>{' '}
              <span className="highlight-ev">EV</span>{' '}
              <span className="highlight-red">TRẠM SẠC XE ĐIỆN</span>
            </h1>
            
            <p className="app-description">
              Nâng cao trải nghiệm sạc của bạn với ỨNG DỤNG thông minh & tiện lợi <span className="highlight-solar">SOLAR</span> <span className="highlight-ev">EV</span>. Tải xuống ngay để dễ dàng tìm kiếm và sử dụng trạm sạc phù hợp cho ô tô điện của bạn. Với ỨNG DỤNG <span className="highlight-solar">SOLAR</span> <span className="highlight-ev">EV</span>, bạn có thể truy cập hệ thống trạm sạc trên toàn quốc một cách nhanh chóng, an toàn và hiệu quả.
            </p>

            <p className="qr-instruction">
              QUÉT MÃ QR BÊN DƯỚI ĐỂ TẢI ỨNG DỤNG
            </p>

            <div className="qr-codes-container">
              <div className="qr-code-item">
                <img 
                  src="/images/qr-google-play.png" 
                  alt="QR Code Google Play Store"
                  className="qr-code-image"
                />
                <a 
                  href="https://play.google.com/store/search?q=solarev&c=apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="app-download-button"
                >
                  <img 
                    src="/images/google-play-button.png" 
                    alt="Get it on Google Play" 
                    className="app-download-button-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </a>
              </div>
              <div className="qr-code-item">
                <img 
                  src="/images/qr-app-store.png" 
                  alt="QR Code Apple App Store"
                  className="qr-code-image"
                />
                <a 
                  href="https://apps.apple.com/vn/app/solarev-tr%E1%BA%A1m-s%E1%BA%A1c-xe-%C4%91i%E1%BB%87n/id6470471363?l=vi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="app-download-button"
                >
                  <img 
                    src="/images/app-store-button.png" 
                    alt="Download on the App Store" 
                    className="app-download-button-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Bên phải: Video */}
          <div className="app-right-section">
            <div className="video-container">
              <div className="video-wrapper">
                <iframe
                  className="youtube-video"
                  src="https://www.youtube.com/embed/CyUmJB6GrT0"
                  title="Hướng dẫn sử dụng App SOLAREV sạc xe ô tô điện"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;

