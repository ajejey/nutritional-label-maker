import React from 'react';

interface GoogleAdUnitProps {
  adSlotId: string;
}

export const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({ adSlotId }) => {
  return (
    <ins 
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3613850686549619"
      data-ad-slot={adSlotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export const initializeAds = (): void => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('AdSense initialization error:', error);
  }
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
