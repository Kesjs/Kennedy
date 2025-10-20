import React from 'react';
import { Link } from 'react-router-dom';
import StaticPageLayout from '../StaticPageLayout';

const StaticContentPage = ({ title, lastUpdated = '1er janvier 2024', children }) => {
  return (
    <StaticPageLayout 
      title={title}
      breadcrumbs={[
        { name: title, path: `/${title.toLowerCase().replace(/\s+/g, '-')}` }
      ]}
    >
      <div className="prose prose-invert max-w-4xl mx-auto">
        <div className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-4">
          Dernière mise à jour : {lastUpdated}
        </div>
        
        {children}
        
        <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
          <p>Si vous avez des questions concernant cette page, veuillez nous contacter à <a href="mailto:contact@gazoduc-invest.com" className="text-primary-400 hover:underline">contact@gazoduc-invest.com</a>.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default StaticContentPage;
