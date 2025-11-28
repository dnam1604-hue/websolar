import React, { useState, useEffect } from 'react';
import StationManagement from './StationManagement';
import NewsManagement from './NewsManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('stations'); // 'stations', 'news', etc.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Lấy từ localStorage nếu có, mặc định là false (expanded)
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved !== null ? saved === 'true' : false;
  });

  // Lưu trạng thái vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const menuItems = [
    {
      id: 'stations',
      label: 'Quản trị trạm sạc',
      icon: '📍'
    },
    {
      id: 'news',
      label: 'Tin tức',
      icon: '📰'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'stations':
        return <StationManagement />;
      case 'news':
        return <NewsManagement />;
      default:
        return <StationManagement />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`admin-page-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              data-title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
