import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './layout/Header';
import Footer from './layout/Footer';

const PageTemplate = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{title || 'Gazoduc Invest'}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageTemplate;
