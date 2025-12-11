import React, { useState, useEffect, useRef } from 'react';
import ContactForm from '../components/ContactForm';
import { FaParking, FaGasPump, FaShoppingCart, FaBuilding, FaRoad, FaMapMarkerAlt } from 'react-icons/fa';
import './PartnerStationsPage.css';

const PartnerStationsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isJumpingRef = useRef(false);
  const hasMovedRef = useRef(false); // Track xem có thực sự drag hay không
  const lastScrollLeftRef = useRef(0); // Track vị trí scroll trước đó để biết hướng kéo

  // Dữ liệu các sections deployment
  const deploymentSections = [
    {
      id: 1,
      title: 'Trạm sạc triển khai tại chung cư - văn phòng',
      intro: 'Trạm sạc xe điện dự kiến triển khai tại CC/VP là các trạm sạc hỗn hợp bao gồm:',
      list: [
        'Trụ sạc nhanh ô tô điện công suất 30kW.',
        'Trụ sạc chậm ô tô điện công suất 11kW.',
        'Trụ sạc xe máy điện (tại khu vực có mái che).'
      ],
      details: 'Tại các Chung cư, tòa nhà văn phòng, SolarEV dự kiến triển khai từ 01-02 trụ sạc ô tô DC30kW (sạc đồng thời cho 01-02 xe ô tô), từ 06-07 trụ sạc AC11KW (sạc đồng thời cho 06-07 xe ô tô) và tối thiểu 04 trụ sạc XMĐ (sạc đồng thời 16 XMĐ).',
      image: '/images/apartment-office.png',
      imageAlt: 'Trạm sạc tại chung cư - văn phòng',
      imagePlaceholder: '/public/images/apartment-office.png'
    },
    {
      id: 2,
      title: 'Trạm sạc triển khai trên quốc lộ - cao tốc',
      intro: 'Thiết bị sạc Ô tô điện triển khai trên đường cao tốc, quốc lộ là trạm sạc nhanh DC công suất 60kW.',
      details: [
        'Thời gian sạc đầy từ 0,7-1,5h. Trạm sạc DC 60KW có 02 cổng sạc, có thể phục vụ đồng thời 02 xe cùng sạc.',
        'Mỗi trạm sạc trên 01 bên của trạm dừng nghỉ SolarEV dự kiến triển khai 10 trụ sạc, có thể đồng thời phục vụ 20 xe cùng sạc.'
      ],
      image: '/images/highway.png',
      imageAlt: 'Trạm sạc trên quốc lộ - cao tốc',
      imagePlaceholder: '/public/images/highway.png'
    },
    {
      id: 3,
      title: 'Trạm sạc triển khai tại bến xe, bãi đỗ xe',
      intro: 'Mô hình trạm sạc xe điện dự kiến triển khai tại các bãi đỗ xe:',
      specs: [
        {
          subtitle: '1. Với trạm sạc ô tô điện:',
          list: [
            'Tối thiểu 05 trụ sạc nhanh ô tô điện công suất 30kW.',
            'Tối thiểu 05 trụ sạc chậm ô tô điện công suất 11kW'
          ]
        },
        {
          subtitle: '2. Với trụ sạc xe máy điện:',
          list: ['Tối thiểu 08 lốt sạc 1,2kW']
        }
      ],
      image: '/images/parking.png',
      imageAlt: 'Trạm sạc tại bến xe, bãi đỗ xe',
      imagePlaceholder: '/public/images/parking.png'
    },
    {
      id: 4,
      title: 'Trạm sạc triển khai tại trung tâm thương mại',
      intro: 'Trạm sạc xe điện dự kiến triển khai tại TTTM là các trạm sạc hỗn hợp bao gồm:',
      list: [
        'Trụ sạc nhanh ô tô điện công suất 30kW.',
        'Trụ sạc chậm ô tô điện công suất 11kW.',
        'Trụ sạc xe máy điện (tại khu vực có mái che).'
      ],
      details: 'Tại Trung tâm thương mại, tòa nhà thuộc TTTM, SolarEV dự kiến triển khai từ 06-08 trụ sạc ô tô DC30kW (sạc đồng thời cho 06-08 xe ô tô), từ 02-04 trụ sạc AC11KW (sạc đồng thời cho 02-04 xe ô tô) và tối thiểu 02 trụ sạc XMĐ (sạc đồng thời 08 XMĐ).',
      image: '/images/mall.png',
      imageAlt: 'Trạm sạc tại trung tâm thương mại',
      imagePlaceholder: '/public/images/mall.png'
    }
  ];

  // Xác định slide ở giữa và xử lý infinite loop mượt mà
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Không xử lý khi đang jump hoặc đang drag
      if (isJumpingRef.current || isDraggingRef.current) return;
      
      const scrollLeft = container.scrollLeft;
      const viewportWidth = window.innerWidth;
      const slideWidth = viewportWidth * 0.7;
      const spaceBetween = 5;
      const totalSlideWidth = slideWidth + spaceBetween;
      
      // Vị trí center của viewport (tính từ scrollLeft)
      // Với padding = (100vw - 70vw) / 2 = 15vw mỗi bên
      const padding = (viewportWidth - slideWidth) / 2;
      const centerPosition = scrollLeft + viewportWidth / 2;
      
      // Tính toán slide nào đang ở giữa màn hình
      // Layout: [clone cuối (index 0), slide1 (index 1), slide2 (index 2), ..., slideN (index N), clone đầu (index N+1)]
      // Vị trí center của slide = padding + domIndex * totalSlideWidth + totalSlideWidth / 2
      // => domIndex = (centerPosition - padding - totalSlideWidth / 2) / totalSlideWidth
      let domIndex = Math.round((centerPosition - padding - totalSlideWidth / 2) / totalSlideWidth);
      
      // Đảm bảo domIndex hợp lệ
      domIndex = Math.max(0, Math.min(domIndex, deploymentSections.length + 1));
      let actualIndex;
      
      // Xử lý infinite loop - nhảy về slide thật khi đến clone
      if (domIndex === 0) {
        // Đến clone cuối (DOM index 0) -> nhảy về slide cuối thật (DOM index = deploymentSections.length)
        if (!isJumpingRef.current) {
          isJumpingRef.current = true;
          container.style.scrollBehavior = 'auto';
          // Slide cuối thật ở DOM index = deploymentSections.length
          const slideCenter = padding + totalSlideWidth * deploymentSections.length + totalSlideWidth / 2;
          const jumpPosition = slideCenter - viewportWidth / 2;
          // Jump ngay lập tức không animation
          container.scrollLeft = jumpPosition;
          // Reset ngay trong frame tiếp theo
          setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
            isJumpingRef.current = false;
          }, 0);
        }
        actualIndex = deploymentSections.length - 1;
      } else if (domIndex === deploymentSections.length + 1) {
        // Đến clone đầu (DOM index N+1) -> nhảy về slide đầu thật (DOM index 1)
        if (!isJumpingRef.current) {
          isJumpingRef.current = true;
          container.style.scrollBehavior = 'auto';
          // Slide đầu thật ở DOM index 1
          const slideCenter = padding + totalSlideWidth * 1 + totalSlideWidth / 2;
          const jumpPosition = slideCenter - viewportWidth / 2;
          // Jump ngay lập tức không animation
          container.scrollLeft = jumpPosition;
          // Reset ngay trong frame tiếp theo
          setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
            isJumpingRef.current = false;
          }, 0);
        }
        actualIndex = 0;
      } else {
        // Tính actualIndex từ domIndex (index 1 -> actualIndex 0, index 2 -> actualIndex 1, ...)
        actualIndex = domIndex - 1;
      }
      
      // Chỉ update khi slide hợp lệ và không phải clone (domIndex > 0 và < N+1)
      if (actualIndex >= 0 && actualIndex < deploymentSections.length && domIndex > 0 && domIndex <= deploymentSections.length) {
        // Tính toán vị trí center mong đợi của slide này
        // Slide thật ở domIndex = actualIndex + 1
        const expectedCenter = padding + totalSlideWidth * (actualIndex + 1) + totalSlideWidth / 2;
        const tolerance = totalSlideWidth * 0.3; // 30% tolerance
        
        // Chỉ update nếu slide thực sự ở gần center
        if (Math.abs(centerPosition - expectedCenter) <= tolerance) {
          if (actualIndex !== currentIndex) {
            setCurrentIndex(actualIndex);
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, deploymentSections.length]);

  // Khởi tạo vị trí ban đầu - scroll đến slide đầu tiên thật (index 1)
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    
    const viewportWidth = window.innerWidth;
    const slideWidth = viewportWidth * 0.7;
    const spaceBetween = 5;
    const totalSlideWidth = slideWidth + spaceBetween;
    const padding = (viewportWidth - slideWidth) / 2;
    
    // Layout: [clone cuối (index 0), slide1 (index 1), slide2 (index 2), ..., slideN (index N), clone đầu (index N+1)]
    // Slide đầu tiên thật ở index 1 (sau clone cuối)
    // Vị trí center của slide index 1 = padding + 1 * totalSlideWidth + totalSlideWidth / 2
    // Scroll position để slide ở giữa = center của slide - viewportWidth / 2
    const slideCenter = padding + totalSlideWidth * 1 + totalSlideWidth / 2;
    const initialPosition = slideCenter - viewportWidth / 2;
    container.scrollLeft = initialPosition;
  }, []);

  // Mouse drag handlers - giữ chuột và kéo
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    e.preventDefault();
    isDraggingRef.current = true;
    hasMovedRef.current = false; // Reset - chưa di chuyển
    const rect = carouselRef.current.getBoundingClientRect();
    startXRef.current = e.pageX - rect.left;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    lastScrollLeftRef.current = carouselRef.current.scrollLeft; // Lưu vị trí ban đầu
    carouselRef.current.style.cursor = 'grabbing';
    carouselRef.current.style.scrollBehavior = 'auto';
    carouselRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  };

  const handleMouseUp = (e) => {
    if (!carouselRef.current || !isDraggingRef.current) return;
    
    const wasDragging = hasMovedRef.current; // Lưu lại trạng thái trước khi reset
    isDraggingRef.current = false;
    hasMovedRef.current = false; // Reset
    carouselRef.current.style.cursor = 'grab';
    carouselRef.current.style.scrollBehavior = 'smooth';
    carouselRef.current.style.userSelect = '';
    
    // Chỉ snap nếu thực sự đã drag (di chuyển chuột)
    if (!wasDragging) return;
    
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const viewportWidth = window.innerWidth;
    const slideWidth = viewportWidth * 0.7;
    const spaceBetween = 5;
    const totalSlideWidth = slideWidth + spaceBetween;
    const padding = (viewportWidth - slideWidth) / 2;
    const centerPosition = scrollLeft + viewportWidth / 2;
    
    // Tính toán hướng kéo (trái hay phải)
    const scrollDelta = scrollLeft - lastScrollLeftRef.current;
    const isScrollingRight = scrollDelta > 0;
    
    // Tính toán slide gần nhất với vị trí center
    // Layout: [clone cuối (index 0), slide1 (index 1), slide2 (index 2), ..., slideN (index N), clone đầu (index N+1)]
    // Vị trí center của slide = padding + domIndex * totalSlideWidth + totalSlideWidth / 2
    // => domIndex = (centerPosition - padding - totalSlideWidth / 2) / totalSlideWidth
    let domIndex = Math.round((centerPosition - padding - totalSlideWidth / 2) / totalSlideWidth);
    
    // Đảm bảo domIndex hợp lệ
    domIndex = Math.max(0, Math.min(domIndex, deploymentSections.length + 1));
    
    // Tính khoảng cách kéo
    const dragDistance = Math.abs(scrollDelta);
    
    // Nếu có kéo (dù nhẹ), luôn ưu tiên slide theo hướng kéo
    if (dragDistance > 0) {
      // Tính toán slide hiện tại dựa trên vị trí center
      const currentDomIndex = Math.round((centerPosition - padding - totalSlideWidth / 2) / totalSlideWidth);
      
      if (isScrollingRight) {
        // Kéo sang phải -> chuyển sang slide trước (index giảm)
        if (currentDomIndex > 1) {
          // Nếu đang ở slide thật, chuyển sang slide trước
          domIndex = currentDomIndex - 1;
        } else if (currentDomIndex === 1) {
          // Nếu đang ở slide đầu thật, chuyển về clone cuối (sẽ jump về slide cuối)
          domIndex = 0;
        } else if (currentDomIndex === 0) {
          // Đang ở clone cuối, giữ nguyên (sẽ jump về slide cuối)
          domIndex = 0;
        }
      } else {
        // Kéo sang trái -> chuyển sang slide sau (index tăng)
        if (currentDomIndex < deploymentSections.length) {
          // Nếu đang ở slide thật, chuyển sang slide sau
          domIndex = currentDomIndex + 1;
        } else if (currentDomIndex === deploymentSections.length) {
          // Nếu đang ở slide cuối thật, chuyển sang clone đầu (sẽ jump về slide đầu)
          domIndex = deploymentSections.length + 1;
        } else if (currentDomIndex === deploymentSections.length + 1) {
          // Đang ở clone đầu, giữ nguyên (sẽ jump về slide đầu)
          domIndex = deploymentSections.length + 1;
        }
      }
      
      // Đảm bảo domIndex hợp lệ
      domIndex = Math.max(0, Math.min(domIndex, deploymentSections.length + 1));
    }
    
    let actualIndex;
    let snapDomIndex;
    
    // Xử lý infinite loop khi snap - nhảy về slide thật
    if (domIndex === 0) {
      // Đang ở clone cuối (DOM index 0) -> snap về slide cuối thật (DOM index = deploymentSections.length)
      snapDomIndex = deploymentSections.length;
      actualIndex = deploymentSections.length - 1;
    } else if (domIndex === deploymentSections.length + 1) {
      // Đang ở clone đầu (DOM index N+1) -> snap về slide đầu thật (DOM index 1)
      snapDomIndex = 1;
      actualIndex = 0;
    } else {
      // Tính actualIndex từ domIndex (index 1 -> actualIndex 0, index 2 -> actualIndex 1, ...)
      snapDomIndex = domIndex;
      actualIndex = domIndex - 1;
    }
    
    // Cập nhật currentIndex ngay lập tức
    if (actualIndex >= 0 && actualIndex < deploymentSections.length) {
      setCurrentIndex(actualIndex);
    }
    
    // Đảm bảo snap chính xác đến center của slide
    // Vị trí center của slide = padding + domIndex * totalSlideWidth + totalSlideWidth / 2
    // Scroll position để slide ở giữa = center của slide - viewportWidth / 2
    const slideCenter = padding + snapDomIndex * totalSlideWidth + totalSlideWidth / 2;
    const snapPosition = slideCenter - viewportWidth / 2;
    
    // Sử dụng requestAnimationFrame để đảm bảo smooth
    requestAnimationFrame(() => {
      container.scrollTo({
        left: snapPosition,
        behavior: 'smooth'
      });
    });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    
    // Đánh dấu đã di chuyển chuột
    hasMovedRef.current = true;
    
    const rect = carouselRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const walk = (x - startXRef.current) * 1.2; // Hệ số drag mượt hơn
    const newScrollLeft = scrollLeftRef.current - walk;
    
    // Lưu vị trí scroll hiện tại để tính hướng kéo
    lastScrollLeftRef.current = newScrollLeft;
    
    // Sử dụng requestAnimationFrame để đảm bảo smooth scrolling
    requestAnimationFrame(() => {
      if (carouselRef.current && isDraggingRef.current) {
        carouselRef.current.scrollLeft = newScrollLeft;
      }
    });
  };

  // Click handler để chuyển slide từ pagination dots
  const handleSlideClick = (index) => {
    if (isDraggingRef.current) return;
    if (index >= 0 && index < deploymentSections.length) {
      setCurrentIndex(index);
      
      // Scroll đến slide được chọn
      const container = carouselRef.current;
      if (!container) return;
      
      const viewportWidth = window.innerWidth;
      const slideWidth = viewportWidth * 0.7;
      const spaceBetween = 5;
      const totalSlideWidth = slideWidth + spaceBetween;
      const padding = (viewportWidth - slideWidth) / 2;
      
      // Slide thật ở domIndex = index + 1 (vì có clone cuối ở index 0)
      const slideCenter = padding + totalSlideWidth * (index + 1) + totalSlideWidth / 2;
      const scrollPosition = slideCenter - viewportWidth / 2;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Render section content
  const renderSectionContent = (section, slideIndex) => {
    // slideIndex: 0 = clone cuối, 1-N = slides thật, N+1 = clone đầu
    // Layout: [clone cuối (index 0), slide1 (index 1), slide2 (index 2), ..., slideN (index N), clone đầu (index N+1)]
    let actualIndex;
    let isClone = false;
    
    if (slideIndex === 0) {
      // Clone cuối -> section cuối
      actualIndex = deploymentSections.length - 1;
      isClone = true;
    } else if (slideIndex === deploymentSections.length + 1) {
      // Clone đầu -> section đầu
      actualIndex = 0;
      isClone = true;
    } else {
      // Slides thật: slideIndex 1 -> actualIndex 0, slideIndex 2 -> actualIndex 1, ...
      actualIndex = slideIndex - 1;
    }
    
    // Clone không bao giờ active
    const isActive = !isClone && actualIndex === currentIndex;
    
    return (
      <div 
        key={`${section.id}-${slideIndex}`}
        className={`deployment-carousel-slide ${isActive ? 'active' : ''}`}
      >
        <div className="deployment-station-content">
          <div className="deployment-station-image">
            <img 
              src={section.image} 
              alt={section.imageAlt}
              className="deployment-station-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="deployment-image-placeholder" style={{ display: 'none' }}>
              Vui lòng thêm ảnh vào: {section.imagePlaceholder}
            </div>
          </div>
          <div className="deployment-station-text">
            <h2 className="deployment-station-title">{section.title}</h2>
            <p className="deployment-station-intro">{section.intro}</p>
            
            {section.list && (
              <ul className="deployment-station-list">
                {section.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            
            {section.specs && (
              <div className="deployment-station-specs">
                {section.specs.map((spec, idx) => (
                  <div key={idx}>
                    <p className="deployment-station-subtitle">{spec.subtitle}</p>
                    <ul className="deployment-station-list">
                      {spec.list.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            
            {section.details && (
              <>
                {Array.isArray(section.details) ? (
                  section.details.map((detail, idx) => (
                    <p key={idx} className="deployment-station-details">{detail}</p>
                  ))
                ) : (
                  <p className="deployment-station-details">{section.details}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Intersection Observer để detect section đang visible - Tạm thời tắt vì đã dùng carousel
  // useEffect(() => {
  //   const observerOptions = {
  //     root: null,
  //     rootMargin: '-80px 0px -50% 0px',
  //     threshold: 0.3
  //   };

  //   const observerCallback = (entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         setActiveSection(entry.target.id);
  //       }
  //     });
  //   };

  //   const observer = new IntersectionObserver(observerCallback, observerOptions);
  //   const sections = ['section1', 'section2', 'section3', 'section4', 'section5'];
  //   sections.forEach(sectionId => {
  //     const element = document.getElementById(sectionId);
  //     if (element) {
  //       observer.observe(element);
  //     }
  //   });

  //   return () => {
  //     sections.forEach(sectionId => {
  //       const element = document.getElementById(sectionId);
  //       if (element) {
  //         observer.unobserve(element);
  //       }
  //     });
  //   };
  // }, []);

  // Map các item quy hoạch - click sẽ scroll đến carousel
  const planningItems = [
    { label: 'Bãi đỗ xe/ Bến xe', hasSection: true, icon: FaParking },
    { label: 'Trạm dừng nghỉ / Trạm đổ xăng dầu', hasSection: true, icon: FaGasPump },
    { label: 'Trung tâm thương mại', hasSection: true, icon: FaShoppingCart },
    { label: 'Chung cư, tòa nhà văn phòng', hasSection: true, icon: FaBuilding },
    { label: 'Cao tốc / Quốc lộ', hasSection: true, icon: FaRoad },
    { label: 'Địa điểm phù hợp khác', hasSection: false, icon: FaMapMarkerAlt },
  ];

  return (
    <div className="partner-stations-page">
      {/* Hero Section */}
      <section className="partner-hero-section">
        <div className="hero-banner-container">
          <img 
            src="https://evsolar.vn/wp-content/uploads/2025/03/image02.png" 
            alt="Hợp tác trạm sạc SolarEV" 
            className="hero-banner-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hero-banner-placeholder" style={{ display: 'none' }}>
            <div className="placeholder-content">
              <span>Banner: Hợp tác trạm sạc SolarEV</span>
              <small>Đang tải ảnh từ: https://evsolar.vn/wp-content/uploads/2025/03/image02.png</small>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="partner-intro-section">
        <div className="section-container">
          <div className="intro-text">
            <p>
              Nhằm khuyến khích người dân sử dụng xe điện, dần thay thế phương tiện sử dụng xăng dầu nhằm giảm khối lượng khí phát thải vào môi trường, 
              SolarEV đang tìm kiếm các đối tác có mặt bằng để hợp tác triển khai các trạm sạc pin xe máy điện và ô tô điện phủ khắp 63 tỉnh thành trên toàn quốc. 
              Dự kiến trong năm 2024, SolarEV sẽ triển khai hơn 2.000 trạm sạc với hơn 40.000 cổng sạc cho xe máy điện và ô tô điện.
            </p>
          </div>
        </div>
      </section>

      {/* Planning Section */}
      <section className="partner-planning-section">
        <div className="section-container">
          <h2 className="section-title">Quy hoạch trạm sạc SolarEV đặt tại</h2>
          <div className="planning-list">
            {planningItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className={`planning-item ${item.hasSection ? 'clickable' : ''}`}
                  style={{ cursor: item.hasSection ? 'pointer' : 'default' }}
                >
                  <div className="planning-item-icon">
                    <IconComponent />
                  </div>
                  <div className="planning-item-label">
                    {index === 2 ? (
                      <>
                        Trung tâm<br />thương mại
                      </>
                    ) : index === 5 ? (
                      <>
                        Địa điểm<br />phù hợp khác
                      </>
                    ) : (
                      item.label
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Station Deployment Carousel Section */}
      <section className="station-deployment-section">
        <div className="deployment-carousel-wrapper">
          <div 
            className="deployment-carousel-container" 
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseLeave}
            style={{ cursor: 'grab' }}
          >
            {/* Clone slide cuối ở đầu danh sách */}
            {renderSectionContent(deploymentSections[deploymentSections.length - 1], 0)}
            
            {/* Các slides thật */}
            {deploymentSections.map((section, index) => (
              renderSectionContent(section, index + 1)
            ))}
            
            {/* Clone slide đầu ở cuối danh sách */}
            {renderSectionContent(deploymentSections[0], deploymentSections.length + 1)}
          </div>
          
          {/* Pagination Dots */}
          <div className="carousel-pagination">
            {deploymentSections.map((section, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleSlideClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Criteria Table Section */}
      <section className="partner-criteria-section">
        <div className="section-container">
          <h2 className="section-title">Tiêu chí chọn địa điểm đặt trạm sạc ô tô điện</h2>
          <div className="criteria-table-wrapper">
            <table className="criteria-table">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th>Mô tả</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diện tích</td>
                  <td>15.3m²/vị trí sạc (2.55x6m). Hoặc theo kích thước các vị trí đỗ xe hiện hữu.</td>
                </tr>
                <tr>
                  <td>Lựa chọn vị trí</td>
                  <td>
                    - Tầng hầm hoặc bãi đỗ xe ngoài trời, thuận tiện cho việc xe ra vào.<br />
                    - Khu vực đặt trạm sạc: khô ráo, không bị ngập nước, tránh các khu vực có nhiều vật liệu dễ cháy, khu vực phát sinh nguồn nhiệt.<br />
                    - Ưu tiên khu vực đặt trạm sạc gần bảo vệ, có người trông coi.<br />
                    - Ưu tiên các vị trí thoáng đãng, thuận lợi cho việc nhận diện thương hiệu.
                  </td>
                </tr>
                <tr>
                  <td>Hạ tầng điện</td>
                  <td>
                    - Điện: 03Pha-380V.<br />
                    - Công suất ≥ 60kW hoặc ≥ 30KW /1 cổng sạc DC. Công suất ≥ 11kW/1 cổng sạc AC.<br />
                    - Ưu tiên các vị trí có sẵn nguồn điện đáp ứng đủ công suất. Với các vị trí cần triển khai nguồn điện mới ưu tiên các vị trí có điểm đấu nối ≤ 300m.<br />
                    - Ưu tiên các vị trí đã có hệ thống tiếp đất.
                  </td>
                </tr>
                <tr>
                  <td>Internet</td>
                  <td>- Ưu tiên vị trí có sẵn Internet có dây, khu vực có sóng di động ổn định.</td>
                </tr>
                <tr>
                  <td>PCCC</td>
                  <td>
                    - Vị trí đặt trạm có sẵn hệ thống báo cháy, chữa cháy tự động.<br />
                    - Ưu tiên vị trí đã có giấy phép PCCC, không cần phê duyệt thay đổi công năng.
                  </td>
                </tr>
                <tr>
                  <td>Mô tả phương án thi công, triển khai</td>
                  <td>
                    - Tổ chức phân luồng lại khu vực đỗ xe để phù hợp với khu vực sạc điện E-Car.<br />
                    - Thi công đường điện kết nối với tủ điện của tòa nhà/điện lực kéo mới, thi công hệ thống điện cấp cho điểm sạc.<br />
                    - Bổ sung các phương tiện PCCN phù hợp với quy định PCCC.<br />
                    - Bổ sung hệ thống camera an ninh, tăng tiện ích cho khách hàng.<br />
                    - Bổ sung hệ thống biển bảng chỉ dẫn, biển thương hiệu.
                  </td>
                </tr>
                <tr>
                  <td>Mô tả công việc vận hành tại trạm sạc</td>
                  <td>
                    - Hệ thống trạm sạc vận hành tự động.<br />
                    - Khách hàng sử dụng ứng dụng trên điện thoại di động để tự phục vụ sạc và thanh toán online.<br />
                    - Định kỳ có kỹ sư SolarEV thực hiện kiểm tra, bảo dưỡng hệ thống trạm sạc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="partner-registration-section">
        <div className="section-container">
          <div className="registration-form-wrapper">
            <ContactForm 
              hideTitle={true}
              submitButtonText="Đăng ký đặt trạm"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerStationsPage;

