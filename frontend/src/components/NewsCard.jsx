import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './NewsCard.css';

const NewsCard = ({ news, featured = false }) => {
  const newsId = news._id || news.id;
  const hasImage = news.image && news.image.trim() !== '';
  const imageUrl = getImageUrl(news.image || '');
  
  return (
    <Link to={`/news/${newsId}`} className={`news-card-link ${featured ? 'news-card-featured' : ''}`}>
      <article className={`news-card ${featured ? 'featured' : ''}`}>
        <div className="news-card-image-container">
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={news.title}
              className="news-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="news-card-image-placeholder" style={{ display: hasImage ? 'none' : 'flex' }}>
            <div className="placeholder-content">
              <span>Ảnh tin tức</span>
              <small>Vui lòng thêm ảnh</small>
            </div>
          </div>
        </div>
        <div className="news-card-content">
          <h3 className="news-card-title">{news.title}</h3>
          <p className="news-card-summary">{news.summary}</p>
          <span className="news-card-read-more">Đọc thêm →</span>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;

