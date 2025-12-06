import React, { useState } from 'react';
import './GuidePage.css';

const GuidePage = () => {
  const [openSections, setOpenSections] = useState(new Set());

  const toggleSection = (section) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="guide-page">
      {/* Header Section */}
      <section className="guide-header-section">
        <div className="section-container">
          <div className="section-header">
            <h1>Hướng dẫn sử dụng trạm sạc</h1>
          </div>
        </div>
      </section>

      {/* Hướng dẫn cài app */}
      <section className="guide-section">
        <div className="section-container">
          <div className="guide-method-section">
            <button 
              className={`method-header-button ${openSections.has('app') ? 'active' : ''}`}
              onClick={() => toggleSection('app')}
            >
              <h2>1) Hướng dẫn cài app SolarEV</h2>
              <span className="dropdown-arrow">{openSections.has('app') ? '▲' : '▼'}</span>
            </button>

            {openSections.has('app') && (
              <div className="guide-steps-list">
              <div className="step-item">
                <div className="step-number">Bước 1</div>
                <div className="step-text">
                  <p>Khách hàng tải app SolarEV trên nền tảng Android và iOS về điện thoại.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 2</div>
                <div className="step-text">
                  <p>Khách hàng tạo tài khoản SolarEV bằng số điện thoại hiện tại, khách hàng sẽ nhận được mã OTP qua tin nhắn SMS để đăng nhập. Nếu khách hàng đã có tài khoản thì có thể đăng nhập trực tiếp.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 3</div>
                <div className="step-text">
                  <p>Khách hàng điền đầy đủ thông tin bao gồm: Họ tên, giới tính, email. Thông tin của SolarEV chỉ được sử dụng để nâng cao chất lượng dịch vụ, không liên quan đến bên thứ ba.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 4</div>
                <div className="step-text">
                  <p>Đăng nhập và sử dụng.</p>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hướng dẫn sạc tại trạm công cộng */}
      <section className="guide-section">
        <div className="section-container">
          <div className="guide-method-section">
            <button 
              className={`method-header-button ${openSections.has('charging') ? 'active' : ''}`}
              onClick={() => toggleSection('charging')}
            >
              <h2>2) Hướng dẫn sạc tại trạm sạc công cộng SolarEV</h2>
              <span className="dropdown-arrow">{openSections.has('charging') ? '▲' : '▼'}</span>
            </button>

            {openSections.has('charging') && (
              <div className="guide-steps-list">
              <div className="step-item">
                <div className="step-number">Bước 1</div>
                <div className="step-text">
                  <p>Khách hàng có thể tìm trạm sạc gần vị trí hiện tại nhất bằng cách sử dụng app SolarEV, click vào ô tìm kiếm, tìm kiếm khu vực mong muốn, sau đó click vào chỉ đường. App sẽ chỉ đường đến trạm sạc.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 2</div>
                <div className="step-text">
                  <p>Khi đến trạm sạc, khách hàng đưa xe vào vị trí sạc còn trống và mở cổng sạc. Vị trí sạc còn trống có thể kiểm tra bằng app SolarEV.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 3</div>
                <div className="step-text">
                  <p>Khách hàng rút vòi sạc, cắm vào xe, sau đó dùng điện thoại đăng nhập vào app SolarEV để quét mã QR được dán trên cột sạc.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">Bước 4</div>
                <div className="step-text">
                  <p>Khách hàng click để chọn xe của mình và chọn gói sạc tương ứng với nhu cầu. SolarEV có các gói sạc được cài đặt sẵn theo giá, hoặc khách hàng có thể chọn "Sạc đến khi đầy" để sạc đến khi pin đầy.</p>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hướng dẫn sạc bằng thẻ */}
      <section className="guide-section">
        <div className="section-container">
          <div className="guide-method-section">
            <button 
              className={`method-header-button ${openSections.has('card') ? 'active' : ''}`}
              onClick={() => toggleSection('card')}
            >
              <h2>3) Hướng dẫn sạc bằng thẻ SolarEV (Trạm private)</h2>
              <span className="dropdown-arrow">{openSections.has('card') ? '▲' : '▼'}</span>
            </button>

            {openSections.has('card') && (
              <div className="guide-steps-list">
                <div className="step-item">
                  <div className="step-number">Bước 1</div>
                  <div className="step-text">
                    <p>Khách hàng tìm trạm sạc private gần nhất bằng cách sử dụng app SolarEV hoặc website, kiểm tra trạng thái và thông tin trạm sạc trước khi đến.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">Bước 2</div>
                  <div className="step-text">
                    <p>Khi đến trạm sạc, khách hàng đưa xe vào vị trí sạc còn trống và mở cổng sạc. Cắm cáp sạc vào cổng sạc của xe điện, đảm bảo kết nối chắc chắn.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">Bước 3</div>
                  <div className="step-text">
                    <p>Khách hàng quẹt thẻ SolarEV vào đầu đọc thẻ trên trạm sạc hoặc nhấn nút bắt đầu sạc trên trạm. Đợi xác nhận từ trạm sạc trước khi rời đi.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">Bước 4</div>
                  <div className="step-text">
                    <p>Theo dõi tiến trình sạc trên màn hình trạm sạc. Bạn sẽ thấy thông tin về dung lượng pin, thời gian sạc và chi phí. Trạm sạc sẽ báo hiệu khi quá trình sạc hoàn tất.</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">Bước 5</div>
                  <div className="step-text">
                    <p>Quẹt thẻ lại hoặc nhấn nút dừng trên trạm sạc để kết thúc quá trình sạc. Thanh toán sẽ được tự động trừ vào thẻ. Rút cáp sạc cẩn thận và đặt lại đúng vị trí.</p>
                  </div>
                </div>

                <div className="card-info-box">
                  <h3>Thông tin về thẻ SolarEV</h3>
                  <ul>
                    <li>Thẻ có thể mua tại các trạm sạc hoặc đặt hàng online qua website và ứng dụng SolarEV</li>
                    <li>Nạp tiền vào thẻ để sử dụng tại bất kỳ trạm sạc private nào trong hệ thống SolarEV</li>
                    <li>Thanh toán tự động sau mỗi lần sạc, số tiền sẽ được trừ trực tiếp từ số dư trong thẻ</li>
                    <li>Kiểm tra số dư và lịch sử giao dịch trên ứng dụng SolarEV hoặc website</li>
                    <li>Thẻ có thể được nạp tiền nhiều lần và không có thời hạn sử dụng</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lưu ý quan trọng */}
      <section className="guide-section">
        <div className="section-container">
          <div className="important-notes">
            <h2>Lưu ý quan trọng</h2>
            <div className="notes-grid">
              <div className="note-card">
                <h3>An toàn</h3>
                <p>Luôn đảm bảo kết nối cáp sạc chắc chắn trước khi bắt đầu sạc. Không chạm vào đầu cắm khi đang sạc. Nếu phát hiện dây cáp bị hỏng hoặc có dấu hiệu bất thường, ngừng sạc ngay lập tức và liên hệ hỗ trợ.</p>
              </div>
              <div className="note-card">
                <h3>Thời gian sạc</h3>
                <p>Thời gian sạc phụ thuộc vào dung lượng pin và công suất trạm sạc. Sạc nhanh DC có thể sạc 80% pin trong 30-45 phút. Sạc AC thông thường mất 4-8 giờ tùy dung lượng pin.</p>
              </div>
              <div className="note-card">
                <h3>Chi phí</h3>
                <p>Chi phí sạc được tính theo kWh hoặc theo gói sạc. Giá có thể khác nhau tùy theo loại trạm sạc và thời điểm. Kiểm tra giá tại trạm sạc hoặc trên ứng dụng SolarEV trước khi sạc.</p>
              </div>
              <div className="note-card">
                <h3>Hỗ trợ</h3>
                <p>Nếu gặp sự cố hoặc có thắc mắc, liên hệ hotline hỗ trợ 24/7 hoặc sử dụng tính năng báo lỗi trên ứng dụng SolarEV. Đội ngũ hỗ trợ sẽ phản hồi nhanh chóng để giải quyết vấn đề của bạn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GuidePage;





