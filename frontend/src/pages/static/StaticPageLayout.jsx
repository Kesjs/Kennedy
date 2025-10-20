import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StaticPageLayout = ({ title, children, breadcrumbs = [] }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Accueil
              </Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-primary-300">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="text-gray-400 hover:text-white transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"></div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="prose prose-invert max-w-none"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default StaticPageLayout;
