import React from 'react';
import StationMap from '../../components/StationMap';
import './StationsPage.css';

const StationsPage = () => {
  return (
    <div className="stations-page">
      <section className="map-section">
        <div className="section-container">
          <StationMap mode="view" />
        </div>
      </section>
    </div>
  );
};

export default StationsPage;

