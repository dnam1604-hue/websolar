import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { stationService } from '../../services/stationService';
import StationMap from '../../components/StationMap';
import './AdminDashboard.css';

const StationManagement = () => {
  const { cmsData, addStation, loadData, loading, error } = useCms();
  const [stationForm, setStationForm] = useState({
    name: '',
    address: '',
    power: '',
    status: 'Hoạt động',
    location: {
      latitude: '',
      longitude: ''
    },
    icon: 'green',
    description: ''
  });
  const [selectedStation, setSelectedStation] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleMapClick = (lat, lng) => {
    setStationForm(prev => ({
      ...prev,
      location: {
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }
    }));
    setIsEditing(false);
    setSelectedStation(null);
  };

  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    setIsEditing(true);
    setStationForm({
      name: station.name || '',
      address: station.address || '',
      power: station.power || '',
      status: station.status || 'Hoạt động',
      location: {
        latitude: station.location?.latitude?.toString() || '',
        longitude: station.location?.longitude?.toString() || ''
      },
      icon: station.icon || 'green',
      description: station.description || ''
    });
    // Scroll đến form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePositionChange = async (stationId, lat, lng) => {
    try {
      const station = cmsData.stations.find(s => (s._id || s.id) === stationId);
      if (station) {
        await stationService.update(stationId, {
          location: {
            latitude: lat,
            longitude: lng
          }
        });
        await loadData();
        setMessage('Đã cập nhật vị trí trạm sạc ✅');
      }
    } catch (err) {
      setMessage('❌ Lỗi khi cập nhật vị trí: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const stationData = {
        ...stationForm,
        location: {
          latitude: stationForm.location?.latitude ? parseFloat(stationForm.location.latitude) : null,
          longitude: stationForm.location?.longitude ? parseFloat(stationForm.location.longitude) : null,
        }
      };

      if (isEditing && selectedStation) {
        await stationService.update(selectedStation._id || selectedStation.id, stationData);
        setMessage('Đã cập nhật trạm sạc ✅');
      } else {
        await addStation(stationData);
        setMessage('Đã thêm trạm sạc mới ✅');
      }

      setStationForm({
        name: '',
        address: '',
        power: '',
        status: 'Hoạt động',
        location: { latitude: '', longitude: '' },
        icon: 'green',
        description: ''
      });
      setSelectedStation(null);
      setIsEditing(false);
      await loadData();
    } catch (err) {
      setMessage('❌ Có lỗi xảy ra: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStation || !window.confirm('Bạn có chắc muốn xóa trạm sạc này?')) {
      return;
    }

    try {
      await stationService.delete(selectedStation._id || selectedStation.id);
      setMessage('Đã xóa trạm sạc ✅');
      setStationForm({
        name: '',
        address: '',
        power: '',
        status: 'Hoạt động',
        location: { latitude: '', longitude: '' },
        icon: 'green',
        description: ''
      });
      setSelectedStation(null);
      setIsEditing(false);
      await loadData();
    } catch (err) {
      setMessage('❌ Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleNewStation = () => {
    setStationForm({
      name: '',
      address: '',
      power: '',
      status: 'Hoạt động',
      location: { latitude: '', longitude: '' },
      icon: 'green',
      description: ''
    });
    setSelectedStation(null);
    setIsEditing(false);
  };

  return (
    <div className="admin-content">
      <header className="admin-content-header">
        <div>
          <h1>Quản trị trạm sạc</h1>
          <p>Thêm và quản lý trạm sạc trên bản đồ tương tác</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={loadData}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Tải lại dữ liệu'}
        </button>
      </header>

      {message && <div className="admin-toast">{message}</div>}
      {error && <div className="admin-toast" style={{ background: '#f44336', color: 'white' }}>❌ {error}</div>}

      <div className="admin-main-layout">
        {/* Form Panel - Bên trái */}
        <div className="admin-form-panel">
          <form ref={formRef} className="admin-card" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{isEditing ? 'Chỉnh sửa trạm sạc' : 'Thêm trạm sạc mới'}</h2>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={handleNewStation}
                >
                  Thêm mới
                </button>
              )}
            </div>

            <label>
              Tên trạm *
              <input
                type="text"
                value={stationForm.name}
                onChange={(e) => setStationForm({ ...stationForm, name: e.target.value })}
                required
                placeholder="VD: Trạm sạc VinFast HCM"
              />
            </label>

            <label>
              Địa chỉ *
              <input
                type="text"
                value={stationForm.address}
                onChange={(e) => setStationForm({ ...stationForm, address: e.target.value })}
                required
                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              />
            </label>

            <label>
              Công suất *
              <input
                type="text"
                value={stationForm.power}
                onChange={(e) => setStationForm({ ...stationForm, power: e.target.value })}
                required
                placeholder="VD: AC 22kW / DC 60kW"
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <label>
                Latitude (Vĩ độ)
                <input
                  type="number"
                  step="any"
                  value={stationForm.location?.latitude || ''}
                  onChange={(e) => setStationForm({ 
                    ...stationForm, 
                    location: { 
                      ...stationForm.location, 
                      latitude: e.target.value 
                    } 
                  })}
                  placeholder="VD: 10.8231"
                />
              </label>
              <label>
                Longitude (Kinh độ)
                <input
                  type="number"
                  step="any"
                  value={stationForm.location?.longitude || ''}
                  onChange={(e) => setStationForm({ 
                    ...stationForm, 
                    location: { 
                      ...stationForm.location, 
                      longitude: e.target.value 
                    } 
                  })}
                  placeholder="VD: 106.6297"
                />
              </label>
            </div>

            <small style={{ color: '#666', fontSize: 'var(--font-size-xs)', display: 'block', marginTop: '-0.5rem', marginBottom: 'var(--spacing-md)' }}>
              💡 Click trên bản đồ để tự động điền tọa độ
            </small>

            <label>
              Trạng thái *
              <select
                value={stationForm.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  let newIcon = 'green';
                  if (newStatus === 'Hoạt động') {
                    newIcon = 'green';
                  } else if (newStatus === 'Bảo trì') {
                    newIcon = 'orange';
                  }
                  setStationForm({ ...stationForm, status: newStatus, icon: newIcon });
                }}
                required
              >
                <option value="Hoạt động">⚡ Hoạt động (Logo: ⚡)</option>
                <option value="Bảo trì">🔧 Bảo trì (Logo: 🔧)</option>
              </select>
            </label>
            
            <small style={{ color: '#666', fontSize: 'var(--font-size-xs)', display: 'block', marginTop: '-0.5rem', marginBottom: 'var(--spacing-md)' }}>
              💡 Logo sẽ tự động hiển thị trên map theo trạng thái đã chọn
            </small>

            <input
              type="hidden"
              value={stationForm.icon}
              onChange={(e) => setStationForm({ ...stationForm, icon: e.target.value })}
            />

            <label>
              Mô tả
              <textarea
                value={stationForm.description}
                onChange={(e) => setStationForm({ ...stationForm, description: e.target.value })}
                rows={3}
                placeholder="Thông tin bổ sung về trạm sạc..."
              />
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm trạm sạc')}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  Xóa
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Map Panel - Bên phải */}
        <div className="admin-map-panel">
          <StationMap
            mode="edit"
            stations={cmsData.stations || []}
            onStationAdd={handleMapClick}
            onStationUpdate={handlePositionChange}
            onStationSelect={handleMarkerClick}
            selectedStationId={selectedStation?._id || selectedStation?.id}
          />
        </div>
      </div>

      {/* Danh sách trạm sạc - Section riêng */}
      <section className="admin-stations-section">
        <div className="admin-stations-header">
          <h2>Danh sách trạm sạc</h2>
          <p>Tổng số: {cmsData.stations?.length || 0} trạm</p>
        </div>
        {loading ? (
          <div className="admin-stations-loading">Đang tải danh sách trạm sạc...</div>
        ) : cmsData.stations?.length > 0 ? (
          <div className="admin-stations-grid">
            {cmsData.stations.map((station) => (
              <div 
                key={station._id || station.id} 
                className={`admin-station-card ${selectedStation && (selectedStation._id || selectedStation.id) === (station._id || station.id) ? 'active' : ''}`}
                onClick={() => handleMarkerClick(station)}
              >
                <div className="station-card-header">
                  <h3>{station.name}</h3>
                  {station.location?.latitude && station.location?.longitude && (
                    <span className="station-location-badge">📍 Có vị trí</span>
                  )}
                </div>
                <div className="station-card-body">
                  <p className="station-address">{station.address}</p>
                  <div className="station-meta">
                    <span className="station-power">{station.power}</span>
                    <span className={`station-status status-${station.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {station.status}
                    </span>
                  </div>
                  {station.description && (
                    <p className="station-description">{station.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-stations-empty">
            <p>Chưa có trạm sạc nào. Hãy thêm trạm sạc mới bằng cách click trên bản đồ.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StationManagement;

