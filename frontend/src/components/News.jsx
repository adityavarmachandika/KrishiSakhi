import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper,
  faCalendarAlt,
  faUser,
  faExternalLinkAlt,
  faArrowRight,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { LatestNews } from '../constants';

const News = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // Flatten all articles from all news objects
      const allArticles = LatestNews.flatMap(newsObj => newsObj.articles || []);
      setFilteredNews(allArticles);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter news based on search query
    const allArticles = LatestNews.flatMap(newsObj => newsObj.articles || []);
    
    if (searchQuery.trim() === '') {
      setFilteredNews(allArticles);
    } else {
      const filtered = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        {/* Skeleton Header */}
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
        
        {/* Skeleton Body */}
        <div className="p-6">
          <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  const NewsCard = ({ article, index }) => (
    <div 
      key={index} 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
      onClick={() => window.open(article.url, '_blank')}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faNewspaper} className="text-green-600 text-sm" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800 block">
                {article.source?.name || 'Unknown Source'}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <FontAwesomeIcon 
            icon={faExternalLinkAlt} 
            className="text-gray-400 group-hover:text-blue-600 transition-colors" 
          />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article.description}
        </p>
        
        {/* Author & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
            <span className="text-xs text-gray-500">
              {article.author || 'Unknown Author'}
            </span>
          </div>
          <div className="flex items-center text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
            Read Article
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agricultural News
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stay updated with the latest trends, research, and developments in agriculture
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredNews.map((article, index) => (
              <NewsCard key={index} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            <FontAwesomeIcon icon={faSearch} className="mx-auto h-10 w-10 mb-4 text-gray-400 text-4xl" />
            <h3 className="text-xl font-semibold mb-2">
              No news articles found
            </h3>
            <p className="mb-2">Try a different keyword or browse all available articles.</p>
            <button
              onClick={() => handleSearch('')}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
            >
              Show All Articles
            </button>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {filteredNews.length}
              </div>
              <div className="text-gray-600">Articles Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {new Set(filteredNews.map(article => article.source?.name || 'Unknown')).size}
              </div>
              <div className="text-gray-600">News Sources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                Daily
              </div>
              <div className="text-gray-600">Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
