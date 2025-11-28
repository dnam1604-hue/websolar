import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import FeaturedNewsCard from '../components/FeaturedNewsCard';
import SidebarNewsCard from '../components/SidebarNewsCard';
import FeaturedNewsCardHorizontal from '../components/FeaturedNewsCardHorizontal';
import NewsCard from '../components/NewsCard';
import FilterDropdown from '../components/FilterDropdown';
import './News.css';

// Dữ liệu mẫu
const mockNews = [
  {
    id: 'news-1',
    title: 'SolarEV ra mắt trạm sạc mới tại Hà Nội',
    summary: 'Trạm sạc mới với công nghệ sạc nhanh, hỗ trợ đa dạng loại xe điện, đặt tại trung tâm thành phố Hà Nội.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'news-2',
    title: 'Công nghệ sạc không dây cho xe điện',
    summary: 'SolarEV đang nghiên cứu và phát triển công nghệ sạc không dây tiên tiến, mang lại trải nghiệm sạc tiện lợi hơn.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'news-3',
    title: 'Hợp tác với các hãng xe điện hàng đầu',
    summary: 'SolarEV ký kết hợp tác chiến lược với nhiều hãng xe điện để mở rộng mạng lưới trạm sạc trên toàn quốc.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'news-4',
    title: 'Ứng dụng SolarEV cập nhật tính năng mới',
    summary: 'Phiên bản mới của ứng dụng SolarEV với nhiều tính năng hữu ích: đặt lịch sạc, thanh toán online, tích điểm thưởng.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'news-5',
    title: 'Giải pháp năng lượng mặt trời cho trạm sạc',
    summary: 'SolarEV triển khai hệ thống pin năng lượng mặt trời tại các trạm sạc, giúp giảm chi phí và bảo vệ môi trường.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  },
  {
    id: 'news-6',
    title: 'Chương trình khuyến mãi tháng này',
    summary: 'Giảm giá 20% cho lần sạc đầu tiên và nhiều ưu đãi hấp dẫn khác dành cho khách hàng mới của SolarEV.',
    image: '',
    content: '',
    link: '',
    createdAt: new Date()
  }
];

const News = () => {
  const { cmsData, loading } = useCms();
  const [activeTab, setActiveTab] = useState('news');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const apiNews = [...(cmsData.news || [])].reverse();
  const allNews = apiNews.length > 0 ? apiNews : mockNews;
  
  // Lấy năm hiện tại và các năm gần đây
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'Năm' },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i)
    }))
  ];
  const monthOptions = [
    { value: '', label: 'Tháng' },
    { value: '01', label: 'Tháng 1' },
    { value: '02', label: 'Tháng 2' },
    { value: '03', label: 'Tháng 3' },
    { value: '04', label: 'Tháng 4' },
    { value: '05', label: 'Tháng 5' },
    { value: '06', label: 'Tháng 6' },
    { value: '07', label: 'Tháng 7' },
    { value: '08', label: 'Tháng 8' },
    { value: '09', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
  ];

  return (
    <div className="news-page">
      {/* Header với Tabs và Filters */}
      <section className="news-page-header">
        <div className="section-container">
          <div className="news-header-content">
            {/* Tabs */}
            <div className="news-tabs">
              <button 
                className={`news-tab ${activeTab === 'news' ? 'active' : ''}`}
                onClick={() => setActiveTab('news')}
              >
                Tin tức
              </button>
              <button 
                className={`news-tab ${activeTab === 'press' ? 'active' : ''}`}
                onClick={() => setActiveTab('press')}
              >
                Thông cáo báo chí
              </button>
              <button 
                className={`news-tab ${activeTab === 'recruitment' ? 'active' : ''}`}
                onClick={() => setActiveTab('recruitment')}
              >
                Tuyển dụng
              </button>
            </div>

            {/* Filters */}
            <div className="news-filters">
              <FilterDropdown
                value={selectedYear}
                onChange={setSelectedYear}
                options={yearOptions}
                placeholder="Năm"
              />
              <FilterDropdown
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={monthOptions}
                placeholder="Tháng"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main News Content Section */}
      <section className="news-page-content">
        <div className="section-container">
          {loading && apiNews.length === 0 ? (
            <div className="news-loading">Đang tải tin tức...</div>
          ) : allNews.length > 0 ? (
            <div className="news-page-layout">
              {/* 1 card lớn bên trái, 2 card nhỏ bên phải */}
              <div className="news-main-layout">
                {/* Featured News - 1 card lớn bên trái */}
                {allNews.length > 0 && (
                  <div className="news-featured-main">
                    <FeaturedNewsCard news={allNews[0]} />
                  </div>
                )}
                
                {/* Sidebar News - các card nhỏ bên phải */}
                {allNews.length > 1 && (
                  <div className="news-sidebar">
                    {allNews.slice(1, 3).map((item) => (
                      <SidebarNewsCard key={item._id || item.id} news={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="news-loading">Chưa có tin tức nào</div>
          )}
        </div>
      </section>

      {/* Featured News Section */}
      {allNews.length > 3 && (
        <section className="news-featured-section">
          <div className="section-container">
            <h2 className="featured-news-section-title">Tin Tức Nổi Bật</h2>
            <div className="featured-news-list">
              {allNews.slice(3).map((item) => (
                <FeaturedNewsCardHorizontal key={item._id || item.id} news={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default News;

