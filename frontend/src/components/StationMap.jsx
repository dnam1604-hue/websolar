import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { stationService } from '../services/stationService';
import './StationMap.css';

// Fix icon issue với Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Logo SVG cho các trạng thái
const getStatusLogo = (status) => {
  if (status === 'Hoạt động') {
    // Logo sạc điện (pin với dấu +)
    return `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V7M10 13V17" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 7H14M6 13H14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="10" cy="10" r="4.5" stroke="white" stroke-width="2" fill="none"/>
        <path d="M10 7.5V12.5M7.5 10H12.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  } else if (status === 'Bảo trì') {
    // Logo cờ lê (wrench)
    return `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 3.5L4 7C2.5 8.5 2.5 10.5 4 12L10 18C11.5 19.5 13.5 19.5 15 18L18.5 14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 6.5L17.5 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 4.5L16.5 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="10" cy="10" r="2" fill="white"/>
      </svg>
    `;
  }
  // Default: Logo sạc điện
  return `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3V7M10 13V17" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 7H14M6 13H14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="10" cy="10" r="4.5" stroke="white" stroke-width="2" fill="none"/>
      <path d="M10 7.5V12.5M7.5 10H12.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
};

// Màu sắc cho các trạng thái
const statusConfig = {
  green: {
    color: '#00A859',    // Hoạt động
    label: 'A'
  },
  blue: {
    color: '#2196F3',     // Sắp khai trương (đã loại bỏ)
    label: 'N'
  },
  orange: {
    color: '#FF9800',     // Bảo trì
    label: 'M'
  },
  red: {
    color: '#F44336',     // Khác/Sự cố
    label: '!'
  }
};

// Tạo custom icon với logo tương ứng với trạng thái
const createIcon = (color = 'green', status = null) => {
  const config = statusConfig[color] || statusConfig.green;
  
  // Lấy logo SVG dựa trên status
  const logoSvg = getStatusLogo(status || 'Hoạt động');
  
  // Tạo HTML cho custom marker với logo SVG
  const iconHtml = `
    <div style="
      background-color: ${config.color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      <div style="
        transform: rotate(45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      ">${logoSvg}</div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Component để tự động fit bounds
function MapBounds({ stations }) {
  const map = useMap();
  const hasFittedRef = useRef(false);
  const stationsKeyRef = useRef('');
  const userInteractedRef = useRef(false);
  const fitBoundsTimeoutRef = useRef(null);
  
  useEffect(() => {
    // Track user interactions (zoom, pan, etc.)
    if (!userInteractedRef.current && map) {
      const handleUserInteraction = () => {
        userInteractedRef.current = true;
      };

      map.on('zoomstart', handleUserInteraction);
      map.on('dragstart', handleUserInteraction);
      map.on('zoomend', () => {
        // Reset after zoom ends to allow fit bounds on new stations
        setTimeout(() => {
          userInteractedRef.current = false;
        }, 2000);
      });

      return () => {
        map.off('zoomstart', handleUserInteraction);
        map.off('dragstart', handleUserInteraction);
      };
    }
  }, [map]);

  useEffect(() => {
    // Clear any pending fitBounds
    if (fitBoundsTimeoutRef.current) {
      clearTimeout(fitBoundsTimeoutRef.current);
    }

    if (stations.length > 0 && map && !userInteractedRef.current) {
      // Tạo key từ stations để so sánh
      const currentKey = JSON.stringify(
        stations
          .filter(s => s.location?.latitude && s.location?.longitude)
          .map(s => `${s._id || s.id}-${s.location.latitude}-${s.location.longitude}`)
          .sort()
      );
      
      // Chỉ fit bounds khi stations thay đổi thực sự và user chưa tương tác
      if (currentKey !== stationsKeyRef.current || !hasFittedRef.current) {
        const fitMapBounds = () => {
          try {
            // Kiểm tra lại xem user đã tương tác chưa
            if (userInteractedRef.current) {
              return;
            }

            if (map._loaded && map.getContainer()) {
              const bounds = L.latLngBounds(
                stations
                  .filter(s => s.location?.latitude && s.location?.longitude)
                  .map(s => [s.location.latitude, s.location.longitude])
              );
              if (bounds.isValid()) {
                // Fit bounds với padding
                map.fitBounds(bounds, { 
                  padding: [50, 50]
                });
                hasFittedRef.current = true;
                stationsKeyRef.current = currentKey;
              }
            } else {
              // Nếu map chưa loaded, đợi thêm một chút
              fitBoundsTimeoutRef.current = setTimeout(fitMapBounds, 100);
            }
          } catch (error) {
            console.error('Error fitting bounds:', error);
          }
        };
        
        // Đợi một chút để đảm bảo map đã render
        fitBoundsTimeoutRef.current = setTimeout(fitMapBounds, 100);
      }
    }

    return () => {
      if (fitBoundsTimeoutRef.current) {
        clearTimeout(fitBoundsTimeoutRef.current);
      }
    };
  }, [stations, map]);
  
  return null;
}

// Component để handle click trên map (chỉ ở edit mode)
function MapClickHandler({ onMapClick, enabled }) {
  const map = useMap();
  
  useEffect(() => {
    if (!enabled || !onMapClick || !map) return;
    
    const handleClick = (e) => {
      try {
        if (e && e.latlng) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      } catch (error) {
        console.error('Error handling map click:', error);
      }
    };
    
    map.on('click', handleClick);
    
    return () => {
      if (map) {
        map.off('click', handleClick);
      }
    };
  }, [map, enabled, onMapClick]);
  
  return null;
}

// Get emoji icon for status (tạm thời) - Helper function
const getStatusEmoji = (station) => {
  if (station.status === 'Hoạt động') {
    return '🟢';
  } else if (station.status === 'Bảo trì') {
    return '🟠';
  }
  return '🟢';
};

// Draggable marker component
function DraggableMarker({ station, onPositionChange, onMarkerClick, icon }) {
  const initialPosition = station.location?.latitude && station.location?.longitude
    ? [station.location.latitude, station.location.longitude]
    : [16.0, 108.0]; // Default to center of Vietnam if no location
  
  const [position, setPosition] = useState(initialPosition);
  const markerRef = useRef(null);

  // Update position if station location changes
  useEffect(() => {
    if (station.location?.latitude && station.location?.longitude) {
      setPosition([station.location.latitude, station.location.longitude]);
    }
  }, [station.location?.latitude, station.location?.longitude]);

  // Force update icon when station changes - Phải đặt trước early return
  useEffect(() => {
    if (markerRef.current && icon) {
      try {
        const marker = markerRef.current;
        // Check if marker has leafletElement (react-leaflet v4+)
        const leafletMarker = marker.leafletElement || marker;
        if (leafletMarker && typeof leafletMarker.setIcon === 'function') {
          leafletMarker.setIcon(icon);
        }
      } catch (error) {
        // Ignore error, icon will be set on next render
      }
    }
  }, [icon, station.status, station.icon]);

  const eventHandlers = {
    dragend: () => {
      try {
        const marker = markerRef.current;
        if (marker != null) {
          // Get leaflet element if using react-leaflet
          const leafletMarker = marker.leafletElement || marker;
          if (leafletMarker && typeof leafletMarker.getLatLng === 'function') {
            const newPosition = leafletMarker.getLatLng();
            if (newPosition && typeof newPosition.lat === 'number' && typeof newPosition.lng === 'number') {
              setPosition([newPosition.lat, newPosition.lng]);
              if (onPositionChange) {
                onPositionChange(station._id || station.id, newPosition.lat, newPosition.lng);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error handling marker drag:', error);
      }
    },
    click: () => {
      if (onMarkerClick) {
        onMarkerClick(station);
      }
    }
  };

  // Ensure position is valid - Early return phải đặt sau tất cả hooks
  if (!position || !Array.isArray(position) || position.length !== 2) {
    return null;
  }

  return (
    <Marker
      draggable={!!onPositionChange}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={icon}
    >
      <Popup>
        <div className="station-popup">
          <h3>
            <span className="status-emoji">{getStatusEmoji(station)}</span>
            {station.name}
          </h3>
          <p><strong>Địa chỉ:</strong> {station.address}</p>
          <p><strong>Công suất:</strong> {station.power}</p>
          <p><strong>Trạng thái:</strong> {station.status}</p>
          {station.description && <p>{station.description}</p>}
        </div>
      </Popup>
    </Marker>
  );
}

const StationMap = ({ 
  mode = 'view', 
  stations = [], 
  onStationAdd, 
  onStationUpdate, 
  onStationSelect,
  selectedStationId = null 
}) => {
  const [mapStations, setMapStations] = useState(stations);
  const [loading, setLoading] = useState(mode === 'view');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    stationType: [], // AC, DC
    status: [], // Đang hoạt động, Sắp ra mắt, Đang bảo trì
    province: '',
    district: ''
  });
  const mapRef = useRef(null); // Ref để lưu map instance

  // Center mặc định: Trung tâm Việt Nam để nhìn thấy toàn bộ đất nước
  const defaultCenter = [16.0, 108.0]; // Tọa độ trung tâm Việt Nam
  const defaultZoom = 6; // Zoom level để nhìn thấy toàn bộ Việt Nam

  const initialLoadRef = useRef(true);
  
  const loadStations = React.useCallback(async (isInitial = false) => {
    try {
      // Chỉ set loading lần đầu tiên, không set khi auto-refresh
      if (isInitial || initialLoadRef.current) {
        setLoading(true);
        initialLoadRef.current = false;
      }
      const response = await stationService.getAll();
      setMapStations(response.data || []);
    } catch (err) {
      setError('Không thể tải dữ liệu trạm sạc');
      console.error(err);
    } finally {
      if (isInitial || initialLoadRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (mode === 'view') {
      loadStations(true); // Initial load
    } else {
      setMapStations(stations);
      setLoading(false);
    }
  }, [mode, loadStations]); // Thêm loadStations vào dependencies

  // Auto-refresh stations in view mode every 5 seconds to sync with admin changes
  // Nhưng không refresh khi user đang tương tác với map
  const isInteractingRef = useRef(false);
  
  useEffect(() => {
    if (mode === 'view') {
      const interval = setInterval(() => {
        // Chỉ refresh nếu user không đang tương tác
        if (!isInteractingRef.current) {
          loadStations(false); // Auto-refresh, không set loading
        }
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [mode, loadStations]);

  const handleMapClick = (lat, lng) => {
    if (mode === 'edit' && onStationAdd) {
      onStationAdd(lat, lng);
    }
  };

  const handlePositionChange = (stationId, lat, lng) => {
    if (mode === 'edit' && onStationUpdate) {
      onStationUpdate(stationId, lat, lng);
    }
  };

  const handleMarkerClick = (station) => {
    if (mode === 'edit' && onStationSelect) {
      onStationSelect(station);
    }
  };

  const getIconForStation = (station) => {
    // Map status to icon color và logo
    let iconColor = station.icon;
    if (!iconColor) {
      if (station.status === 'Hoạt động') {
        iconColor = 'green';
      } else if (station.status === 'Bảo trì') {
        iconColor = 'orange';
      } else {
        iconColor = 'green';
      }
    }
    // Truyền status để hiển thị logo đúng
    return createIcon(iconColor, station.status);
  };

  // Filter stations based on filters
  const filteredStations = React.useMemo(() => {
    return mapStations.filter(station => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          station.name?.toLowerCase().includes(searchLower) ||
          station.address?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Station type filter (AC/DC from power field)
      if (filters.stationType.length > 0) {
        const powerUpper = station.power?.toUpperCase() || '';
        const matchesType = filters.stationType.some(type => 
          powerUpper.includes(type.toUpperCase())
        );
        if (!matchesType) return false;
      }

      // Status filter
      if (filters.status.length > 0) {
        const statusMap = {
          'Đang hoạt động': 'Hoạt động',
          'Đang bảo trì': 'Bảo trì'
        };
        const matchesStatus = filters.status.some(filterStatus => {
          const mappedStatus = statusMap[filterStatus] || filterStatus;
          return station.status === mappedStatus;
        });
        if (!matchesStatus) return false;
      }

      return true;
    });
  }, [mapStations, filters]);

  const stationsWithLocation = filteredStations.filter(
    s => s.location?.latitude && s.location?.longitude
  );

  // Hiển thị loading nhưng vẫn render map
  if (loading && mode === 'view') {
    return (
      <div className="station-map-container">
        {mode === 'view' && (
          <div className="map-header">
            <h2>Tìm trạm sạc gần bạn</h2>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          minZoom={1}
          maxZoom={19}
          style={{ height: mode === 'edit' ? '600px' : '700px', width: '100%' }}
          scrollWheelZoom={true}
          whenReady={() => {
            // Map đã sẵn sàng
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="station-map-container">
        <div className="map-error">{error}</div>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          minZoom={1}
          maxZoom={19}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }

  return (
    <div className={`station-map-container ${mode === 'edit' ? 'map-edit-mode' : ''}`}>
      {/* Search Panel - Chỉ hiển thị ở view mode */}
      {mode === 'view' && (
        <div className="map-search-panel">
          <h3>Tìm trạm sạc</h3>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Nhập địa chỉ..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />

          {/* Filters Row */}
          <div className="filters-row">
            {/* Loại Trạm */}
            <div className="filter-group">
              <label>Loại Trạm</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.stationType.includes('AC')}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.stationType, 'AC']
                        : filters.stationType.filter(t => t !== 'AC');
                      setFilters({ ...filters, stationType: newTypes });
                    }}
                  />
                  <span>AC</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.stationType.includes('DC')}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.stationType, 'DC']
                        : filters.stationType.filter(t => t !== 'DC');
                      setFilters({ ...filters, stationType: newTypes });
                    }}
                  />
                  <span>DC</span>
                </label>
              </div>
            </div>

            {/* Tình trạng Hiện tại */}
            <div className="filter-group">
              <label>Tình trạng Hiện tại</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('Đang hoạt động')}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? [...filters.status, 'Đang hoạt động']
                        : filters.status.filter(s => s !== 'Đang hoạt động');
                      setFilters({ ...filters, status: newStatus });
                    }}
                  />
                  <span>Đang hoạt động</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('Đang bảo trì')}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? [...filters.status, 'Đang bảo trì']
                        : filters.status.filter(s => s !== 'Đang bảo trì');
                      setFilters({ ...filters, status: newStatus });
                    }}
                  />
                  <span>Đang bảo trì</span>
                </label>
              </div>
            </div>
          </div>

          {/* Khu vực tìm kiếm */}
          <div className="search-area">
            <label>Khu vực tìm kiếm</label>
            <div className="select-group">
              <select
                value={filters.province}
                onChange={(e) => setFilters({ ...filters, province: e.target.value, district: '' })}
                className="select-input"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="hn">Hà Nội</option>
                <option value="dn">Đà Nẵng</option>
                <option value="hp">Hải Phòng</option>
                <option value="ct">Cần Thơ</option>
              </select>
              <select
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="select-input"
                disabled={!filters.province}
              >
                <option value="">Chọn quận/huyện</option>
                {filters.province === 'hcm' && (
                  <>
                    <option value="q1">Quận 1</option>
                    <option value="q2">Quận 2</option>
                    <option value="q3">Quận 3</option>
                    <option value="q4">Quận 4</option>
                    <option value="q5">Quận 5</option>
                    <option value="q6">Quận 6</option>
                    <option value="q7">Quận 7</option>
                    <option value="q8">Quận 8</option>
                    <option value="q9">Quận 9</option>
                    <option value="q10">Quận 10</option>
                    <option value="q11">Quận 11</option>
                    <option value="q12">Quận 12</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {mode === 'view' && (
        <div className="map-header">
          <h2>Tìm trạm sạc</h2>
          <p>Tổng số trạm: {stationsWithLocation.length}</p>
        </div>
      )}
      
      {mode === 'edit' && (
        <div className="map-edit-header">
          <h3>Bản đồ tương tác</h3>
          <p>Click trên bản đồ để thêm trạm mới • Kéo marker để di chuyển • Click marker để chỉnh sửa</p>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={1}
        maxZoom={19}
        style={{ height: mode === 'edit' ? '600px' : '700px', width: '100%' }}
        scrollWheelZoom={true}
        whenReady={(map) => {
          // Lưu map instance để tránh re-render
          if (map.target) {
            mapRef.current = map.target;
          }
          
          // Track user interactions để tránh reload khi đang kéo/zoom
          if (mode === 'view' && map.target) {
            const leafletMap = map.target;
            
            const handleInteractionStart = () => {
              isInteractingRef.current = true;
            };
            
            const handleInteractionEnd = () => {
              // Reset sau khi user ngừng tương tác 1 giây
              setTimeout(() => {
                isInteractingRef.current = false;
              }, 1000);
            };
            
            leafletMap.on('dragstart', handleInteractionStart);
            leafletMap.on('zoomstart', handleInteractionStart);
            leafletMap.on('dragend', handleInteractionEnd);
            leafletMap.on('zoomend', handleInteractionEnd);
            leafletMap.on('moveend', handleInteractionEnd);
          }
        }}
        key="station-map" // Thêm key để tránh re-render không cần thiết
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Tắt tự động zoom - để user tự điều khiển */}
        {/* {mode === 'view' && stationsWithLocation.length > 0 && (
          <MapBounds stations={stationsWithLocation} />
        )} */}
        
        <MapClickHandler 
          onMapClick={handleMapClick} 
          enabled={mode === 'edit'} 
        />
        
        {stationsWithLocation.map((station) => (
          mode === 'edit' ? (
            <DraggableMarker
              key={station._id || station.id}
              station={station}
              onPositionChange={handlePositionChange}
              onMarkerClick={handleMarkerClick}
              icon={getIconForStation(station)}
            />
          ) : (
            <Marker
              key={station._id || station.id}
              position={[station.location.latitude, station.location.longitude]}
              icon={getIconForStation(station)}
            >
              <Popup>
                <div className="station-popup">
                  <h3>
                    <span className="status-emoji">{getStatusEmoji(station)}</span>
                    {station.name}
                  </h3>
                  <p><strong>Địa chỉ:</strong> {station.address}</p>
                  <p><strong>Công suất:</strong> {station.power}</p>
                  <p><strong>Trạng thái:</strong> {station.status}</p>
                  {station.description && <p>{station.description}</p>}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMap;


