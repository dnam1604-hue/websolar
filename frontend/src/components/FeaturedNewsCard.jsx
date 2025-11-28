import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './FeaturedNewsCard.css';

const FeaturedNewsCard = ({ news }) => {
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
    <Link to={`/news/${newsId}`} className="featured-news-card-link">
      <article className="featured-news-card">
        <div className="featured-news-image-container">
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={news.title}
              className="featured-news-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="featured-news-image-placeholder" style={{ display: hasImage ? 'none' : 'flex' }}>
            <div className="placeholder-content">
              <span>Ảnh tin tức</span>
              <small>Vui lòng thêm ảnh</small>
            </div>
          </div>
          
          {/* Overlay với text - luôn hiển thị */}
          <div className="featured-news-overlay">
            <div className="featured-news-overlay-content">
              <h3 className="featured-news-overlay-title">{news.title}</h3>
              {formattedDate && (
                <time className="featured-news-overlay-date">{formattedDate}</time>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedNewsCard;

