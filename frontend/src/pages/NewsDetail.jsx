import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import { getImageUrl } from '../utils/imageUtils';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getById(id);
        if (response.success) {
          setNews(response.data);
        } else {
          setError('Không tìm thấy tin tức');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải tin tức');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="section-container">
          <div className="news-detail-loading">Đang tải tin tức...</div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail-page">
        <div className="section-container">
          <div className="news-detail-error">
            <p>{error || 'Không tìm thấy tin tức'}</p>
            <Link to="/" className="btn btn-primary">Về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(news.image || '');
  const formattedDate = news.createdAt 
    ? new Date(news.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="news-detail-page">
      <article className="news-detail">
        <div className="section-container">
          <Link to="/" className="news-detail-back">
            ← Quay lại trang chủ
          </Link>

          <header className="news-detail-header">
            <h1 className="news-detail-title">{news.title}</h1>
            {formattedDate && (
              <time className="news-detail-date">{formattedDate}</time>
            )}
          </header>

          <div className="news-detail-image-container">
            <img 
              src={imageUrl} 
              alt={news.title}
              className="news-detail-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="news-detail-image-placeholder">
              <span>Ảnh tin tức</span>
            </div>
          </div>

          <div className="news-detail-content">
            <div className="news-detail-summary">
              <p>{news.summary}</p>
            </div>
            
            {news.content && (
              <div 
                className="news-detail-body"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            )}

            {news.link && (
              <div className="news-detail-link">
                <a 
                  href={news.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Xem thêm tại nguồn →
                </a>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

