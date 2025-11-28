import React from 'react';
import '../FeaturedNewsCardHorizontal.css';

const AdminFeaturedNewsCardHorizontal = ({ news, onClick, isSelected }) => {
  const hasImage = news.image && news.image.trim() !== '';
  const imageUrl = news.image || '';
  
  const formattedDate = news.createdAt 
    ? new Date(news.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <article 
      className={`featured-news-horizontal-card admin-editable ${isSelected ? 'admin-selected' : ''}`}
      onClick={() => onClick && onClick(news)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Left Section - Image */}
      <div className="featured-news-horizontal-left">
        <div className="news-image-container">
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={news.title}
              className="news-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="news-image-placeholder" style={{ display: hasImage ? 'none' : 'flex' }}>
            <span>Ảnh tin tức</span>
          </div>
        </div>
      </div>

      {/* Right Section - News Content */}
      <div className="featured-news-horizontal-right">
        <h3 className="featured-news-horizontal-title">{news.title}</h3>
        {formattedDate && (
          <time className="featured-news-horizontal-date">{formattedDate}</time>
        )}
        <div className="featured-news-horizontal-content">
          <p>{news.summary}</p>
          {news.content && (
            <p>{news.content}</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default AdminFeaturedNewsCardHorizontal;

