import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReferralPageNew from './ReferralPageNew';

const ReferralWrapper = () => {
  const location = useLocation();

  // Déterminer l'onglet actif basé sur l'URL
  const getActiveTabFromPath = (pathname) => {
    if (pathname.includes('/link')) return 'link';
    if (pathname.includes('/referrals')) return 'referrals';
    if (pathname.includes('/commissions')) return 'commissions';
    return 'overview';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  return <ReferralPageNew initialTab={activeTab} />;
};

export default ReferralWrapper;
