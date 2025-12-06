import React from 'react';
import UserPage from './UserPage';
import AppPage from './AppPage';
import GuidePage from './GuidePage';
import ConsultationPage from './ConsultationPage';
import StationsPage from './StationsPage';

// Export các page components
export { AppPage };
export { GuidePage };
export { ConsultationPage };
export { StationsPage };
export const PackagesPage = () => <UserPage content={null} />;
export const FaqPage = () => <UserPage content={null} />;
