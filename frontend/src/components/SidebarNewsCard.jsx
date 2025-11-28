import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './SidebarNewsCard.css';

const SidebarNewsCard = ({ news }) => {
  const newsId = news._id || news.id;
  const hasImage = news.image && news.image.trim() !== '';
  const imageUrl = getImageUrl(news.image || '');
  
  const formattedDate = news.createdAt 
    ? new Date(news.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <Link to={`/news/${newsId}`} className="sidebar-news-card-link">
      <article className="sidebar-news-card">
        <div className="sidebar-news-image-container">
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={news.title}
              className="sidebar-news-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="sidebar-news-image-placeholder" style={{ display: hasImage ? 'none' : 'flex' }}>
            <div className="placeholder-content">
              <span>Ảnh tin tức</span>
              <small>Vui lòng thêm ảnh</small>
            </div>
          </div>
          
          {/* Overlay với text - luôn hiển thị trên ảnh */}
          <div className="sidebar-news-overlay">
            <div className="sidebar-news-overlay-content">
              <h4 className="sidebar-news-overlay-title">{news.title}</h4>
              {formattedDate && (
                <time className="sidebar-news-overlay-date">{formattedDate}</time>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default SidebarNewsCard;

