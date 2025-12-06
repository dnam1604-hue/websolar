import React, { useState } from 'react';
import { contactService } from '../../services/contactService';
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import './ConsultationPage.css';

const ConsultationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Tư vấn lắp đặt',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung tin nhắn là bắt buộc';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung tin nhắn phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await contactService.create(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'Tư vấn lắp đặt',
          message: ''
        });
        
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-page">
      {/* Header Section */}
      <section className="consultation-header">
        <div className="section-container">
          <h1>Tư vấn lắp đặt và liên hệ</h1>
          <p className="consultation-subtitle">
            Chúng tôi sẵn sàng hỗ trợ bạn với giải pháp sạc xe điện phù hợp nhất
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="consultation-main">
        <div className="section-container">
          <div className="consultation-layout">
            {/* Form Section */}
            <div className="consultation-form-section">
              <div className="form-header">
                <h2>Gửi yêu cầu tư vấn</h2>
                <p>Điền thông tin bên dưới, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</p>
              </div>

              {success && (
                <div className="form-success-message">
                  <MdCheckCircle className="success-icon" />
                  <div>
                    <strong>Gửi thành công!</strong>
                    <p>Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi sớm nhất có thể.</p>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="form-error-message">
                  {errors.submit}
                </div>
              )}

              <form className="consultation-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Họ tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Nhập họ tên của bạn"
                      disabled={loading || success}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="0123456789"
                      disabled={loading || success}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                    disabled={loading || success}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="type">
                    Loại yêu cầu <span className="required">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={loading || success}
                  >
                    <option value="Tư vấn lắp đặt">Tư vấn lắp đặt</option>
                    <option value="Hợp tác">Hợp tác</option>
                    <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Nội dung yêu cầu <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    rows={6}
                    placeholder="Vui lòng mô tả chi tiết yêu cầu của bạn..."
                    disabled={loading || success}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || success}
                >
                  {loading ? 'Đang gửi...' : success ? 'Đã gửi thành công!' : 'Gửi yêu cầu'}
                </button>
              </form>
            </div>

            {/* Contact Info Section */}
            <div className="consultation-info-section">
              <h2>Thông tin liên hệ</h2>
              
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <div className="contact-icon">
                    <MdPhone />
                  </div>
                  <div className="contact-content">
                    <h3>Hotline</h3>
                    <p>Sales: <a href="tel:+84859977018">(+84) 859 977 018</a></p>
                    <p>Service/Bảo trì: <a href="tel:+84857977018">(+84) 857 977 018</a></p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <MdEmail />
                  </div>
                  <div className="contact-content">
                    <h3>Email</h3>
                    <p><a href="mailto:sales@focussolar.vn">sales@focussolar.vn</a></p>
                    <p><a href="mailto:support@solarev.vn">support@solarev.vn</a></p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <MdLocationOn />
                  </div>
                  <div className="contact-content">
                    <h3>Địa chỉ</h3>
                    <p>01 đường 48, KDC Nam Long, TP. Thủ Đức, TP.HCM</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon">
                    <MdAccessTime />
                  </div>
                  <div className="contact-content">
                    <h3>Giờ làm việc</h3>
                    <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p>Thứ 7: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultationPage;

