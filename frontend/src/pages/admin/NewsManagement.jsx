import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { newsService } from '../../services/newsService';
import uploadService from '../../services/uploadService';
import { getImageUrl } from '../../utils/imageUtils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFeaturedNewsCard from '../../components/admin/AdminFeaturedNewsCard';
import AdminSidebarNewsCard from '../../components/admin/AdminSidebarNewsCard';
import AdminFeaturedNewsCardHorizontal from '../../components/admin/AdminFeaturedNewsCardHorizontal';
import '../News.css';
import './AdminDashboard.css';

const NewsManagement = () => {
  const { cmsData, addNews, loadData, loading, error } = useCms();
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    link: '',
    status: 'published'
  });
  const [selectedNews, setSelectedNews] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAllNews();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadAllNews = async () => {
    try {
      const response = await newsService.getAll();
      setAllNews(response.data || []);
    } catch (err) {
      setMessage('❌ Lỗi khi tải tin tức: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (news) => {
    setSelectedNews(news);
    setIsEditing(true);
    setShowForm(true);
    setNewsForm({
      title: news.title || '',
      summary: news.summary || '',
      content: news.content || '',
      image: news.image || '',
      link: news.link || '',
      status: news.status || 'published'
    });
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.admin-news-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNew = () => {
    setNewsForm({
      title: '',
      summary: '',
      content: '',
      image: '',
      link: '',
      status: 'published'
    });
    setSelectedNews(null);
    setIsEditing(false);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.admin-news-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setUploadingImage(true);
    setMessage('');

    try {
      const response = await uploadService.uploadImage(file);
      if (response.success && response.imageUrl) {
        setNewsForm({ ...newsForm, image: response.imageUrl });
        setMessage('✅ Upload ảnh thành công');
      } else {
        setMessage('❌ Upload ảnh thất bại');
      }
    } catch (error) {
      setMessage('❌ Lỗi khi upload ảnh: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingImage(false);
      // Reset input để có thể upload lại cùng file
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (isEditing && selectedNews) {
        await newsService.update(selectedNews._id || selectedNews.id, newsForm);
        setMessage('Đã cập nhật tin tức ✅');
      } else {
        await addNews(newsForm);
        setMessage('Đã thêm tin tức mới ✅');
      }

      setNewsForm({
        title: '',
        summary: '',
        content: '',
        image: '',
        link: '',
        status: 'published'
      });
      setSelectedNews(null);
      setIsEditing(false);
      setShowForm(false);
      await loadData();
      await loadAllNews();
    } catch (err) {
      setMessage('❌ Có lỗi xảy ra: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tức này?')) {
      return;
    }

    try {
      await newsService.delete(newsId);
      setMessage('Đã xóa tin tức ✅');
      await loadData();
      await loadAllNews();
      if (selectedNews && (selectedNews._id || selectedNews.id) === newsId) {
        handleNew();
      }
    } catch (err) {
      setMessage('❌ Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
    }
  };

  const apiNews = [...(allNews || [])].reverse();
  const allNewsDisplay = apiNews.length > 0 ? apiNews : [];

  return (
    <div className="admin-content">
      <header className="admin-content-header">
        <div>
          <h1>Quản trị tin tức</h1>
          <p>Thêm, chỉnh sửa và quản lý tin tức</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleNew}
            disabled={loading}
          >
            + Thêm tin tức mới
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={loadAllNews}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>
      </header>

      {message && <div className="admin-toast">{message}</div>}
      {error && <div className="admin-toast" style={{ background: '#f44336', color: 'white' }}>❌ {error}</div>}

      {/* Form Panel - Khu vực tạo/chỉnh sửa */}
      {showForm && (
        <div className="admin-news-form-section">
          <form className="admin-card" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{isEditing ? `Chỉnh sửa: ${selectedNews?.title || ''}` : 'Thêm tin tức mới'}</h2>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setSelectedNews(null);
                }}
              >
                Đóng
              </button>
            </div>

            <label>
              Tiêu đề *
              <input
                type="text"
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                required
                placeholder="VD: Công nghệ sạc nhanh mới nhất"
                maxLength={200}
              />
              <span className="char-counter">
                {newsForm.title.length} / 200 ký tự
              </span>
            </label>

            <label>
              Tóm tắt *
              <textarea
                value={newsForm.summary}
                onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                required
                rows={4}
                placeholder="Mô tả ngắn gọn về tin tức..."
                maxLength={500}
              />
              <span className="char-counter">
                {newsForm.summary.length} / 500 ký tự
              </span>
            </label>

            <label>
              Nội dung đầy đủ
              <div className="news-content-editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={newsForm.content || ''}
                  onChange={(value) => setNewsForm({ ...newsForm, content: value })}
                  placeholder="Nhập nội dung bài viết..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      ['link', 'image'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['clean']
                    ],
                    clipboard: {
                      matchVisual: false
                    },
                    history: {
                      delay: 1000,
                      maxStack: 50,
                      userOnly: true
                    }
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet', 'indent',
                    'link', 'image',
                    'color', 'background',
                    'align'
                  ]}
                />
              </div>
            </label>

            <label>
              Ảnh tin tức
              <div className="image-upload-section">
                <div className="image-upload-options">
                  <div className="upload-option">
                    <label className="upload-file-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                      <span className="upload-button">
                        {uploadingImage ? 'Đang upload...' : '📤 Upload ảnh'}
                      </span>
                    </label>
                    <span className="upload-hint">Hoặc nhập URL</span>
                  </div>
                  <input
                    type="url"
                    value={newsForm.image}
                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="image-url-input"
                  />
                </div>
                {newsForm.image && (
                  <div className="image-preview">
                    <img 
                      src={getImageUrl(newsForm.image)}
                      alt="Preview" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="image-preview-error" style={{ display: 'none' }}>
                      <span>Không thể tải ảnh</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewsForm({ ...newsForm, image: '' })}
                      className="remove-image-btn"
                    >
                      ✕ Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </label>

            <label>
              Link
              <input
                type="url"
                value={newsForm.link}
                onChange={(e) => setNewsForm({ ...newsForm, link: e.target.value })}
                placeholder="https://example.com/news"
              />
            </label>

            <label>
              Trạng thái *
              <select
                value={newsForm.status}
                onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}
                required
              >
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm tin tức')}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedNews._id || selectedNews.id)}
                  disabled={submitting}
                >
                  Xóa
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* News Layout - Giống News page */}
      {loading && allNewsDisplay.length === 0 ? (
        <div className="news-loading">Đang tải tin tức...</div>
      ) : allNewsDisplay.length > 0 ? (
        <div className="news-page">
          {/* Main News Content Section */}
          <section className="news-page-content">
            <div className="section-container">
              <div className="news-page-layout">
                {/* 1 card lớn bên trái, 2 card nhỏ bên phải */}
                <div className="news-main-layout">
                  {/* Featured News - 1 card lớn bên trái */}
                  {allNewsDisplay.length > 0 && (
                    <div className="news-featured-main">
                      <AdminFeaturedNewsCard 
                        news={allNewsDisplay[0]}
                        onClick={handleEdit}
                        isSelected={selectedNews && (selectedNews._id || selectedNews.id) === (allNewsDisplay[0]._id || allNewsDisplay[0].id)}
                      />
                    </div>
                  )}
                  
                  {/* Sidebar News - các card nhỏ bên phải */}
                  {allNewsDisplay.length > 1 && (
                    <div className="news-sidebar">
                      {allNewsDisplay.slice(1, 3).map((item) => (
                        <AdminSidebarNewsCard 
                          key={item._id || item.id}
                          news={item}
                          onClick={handleEdit}
                          isSelected={selectedNews && (selectedNews._id || selectedNews.id) === (item._id || item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Featured News Section */}
          {allNewsDisplay.length > 3 && (
            <section className="news-featured-section">
              <div className="section-container">
                <h2 className="featured-news-section-title">Tin Tức Nổi Bật</h2>
                <div className="featured-news-list">
                  {allNewsDisplay.slice(3).map((item) => (
                    <AdminFeaturedNewsCardHorizontal 
                      key={item._id || item.id}
                      news={item}
                      onClick={handleEdit}
                      isSelected={selectedNews && (selectedNews._id || selectedNews.id) === (item._id || item.id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="news-loading">Chưa có tin tức nào. Hãy thêm tin tức mới.</div>
      )}
    </div>
  );
};

export default NewsManagement;

