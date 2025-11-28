import React from 'react';
import ContactForm from '../components/ContactForm';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Liên hệ với chúng tôi</h1>
          <p>
            Bạn có câu hỏi hoặc cần tư vấn? Hãy điền form bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-info">
          <h2>Thông tin liên hệ</h2>
          <div className="contact-info-item">
            <h3>Hotline</h3>
            <p>Sales: (+84) 859 977 018</p>
            <p>Service/Bảo trì: (+84) 857 977 018</p>
          </div>
          <div className="contact-info-item">
            <h3>Email</h3>
            <p>sales@focussolar.vn</p>
            <p>support@solarev.vn</p>
          </div>
          <div className="contact-info-item">
            <h3>Địa chỉ</h3>
            <p>01 đường 48, KDC Nam Long, TP. Thủ Đức, TP.HCM</p>
          </div>
          <div className="contact-info-item">
            <h3>Giờ làm việc</h3>
            <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
            <p>Thứ 7: 8:00 - 12:00</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;

