import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faChartLine, 
  faLeaf, 
  faSeedling,
  faCloud,
  faTasks,
  faArrowRight,
  faUsers,
  faGlobe,
  faNewspaper,
  faCalendarAlt,
  faUser,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import MainPage_Image from "../assets/MainPage_Image.jpg";
import WeatherWidget from './WeatherWidget';
import Task from './Task';
import Updates from './Updates';
import { LatestNews } from '../constants';

const Home = () => {
  const { user, isLoggedIn } = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: 1,
      icon: faComments,
      title: "AI Chat Assistant",
      description: "Get instant farming advice and solutions powered by AI",
      color: "from-green-400 to-green-600",
      delay: "0s"
    },
    {
      id: 2,
      icon: faChartLine,
      title: "Activity Logging",
      description: "Track and analyze your farming activities efficiently",
      color: "from-blue-400 to-blue-600", 
      delay: "0.2s"
    },
    {
      id: 3,
      icon: faCloud,
      title: "Weather Insights",
      description: "Real-time weather updates for better crop planning",
      color: "from-purple-400 to-purple-600",
      delay: "0.4s"
    },
    {
      id: 4,
      icon: faTasks,
      title: "Task Management",
      description: "Organize and prioritize your farm tasks effectively",
      color: "from-orange-400 to-orange-600",
      delay: "0.6s"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 pt-24">
      {/* Hero Section */}
    
            {/* Hero Section */}
      <section className="container mx-auto px-6 py-20" id="hero">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full mb-8 border border-green-200">
              <FontAwesomeIcon icon={faLeaf} className="mr-2 text-sm" />
              <span className="font-medium text-sm">Smart Farming Assistant</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                Krishi Sakhi
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Your intelligent farming companion powered by AI. Get personalized advice, 
              track activities, and optimize your agricultural practices for better yields.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to={isLoggedIn ? "/chat" : "/login"}>
              <button className="group bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-green-700 transition-all duration-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faComments} className="mr-3" />
                Start Chatting
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              </Link>
              <Link to={isLoggedIn ? "/activity-logging" : "/login"}>
                <button className="group bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-green-300 hover:text-green-700 flex items-center justify-center w-full">
                  <FontAwesomeIcon icon={faChartLine} className="mr-3" />
                  Track Activities
                </button>
              </Link>
            </div>

            {/* Stats */}
          </div>

          {/* Right Image */}
          <div className={`transform transition-all duration-800 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="relative">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                <img 
                  src={MainPage_Image} 
                  alt="Krishi Sakhi Dashboard" 
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
        <Updates/>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16" id="about">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI-powered tools can transform your agricultural practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100 hover:border-green-200 animate-fade-in-up`}
              style={{ animationDelay: feature.delay }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className={`text-2xl text-white transition-all duration-300 ${hoveredCard === feature.id ? 'animate-pulse' : ''}`}
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-green-600 font-semibold flex items-center">
                  Learn More 
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Farming Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor weather, manage tasks, and stay updated with real-time insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2">
          {/* Weather Widget */}
          <div className="transform hover:-translate-y-1 transition-all duration-300" id="weather">
            <WeatherWidget />
          </div>

          {/* Task Management */}
          <div className="transform hover:-translate-y-1 transition-all duration-300">
            <Task />
          </div>          
        </div>
      </section>

      {/* Chat Section */}
      <section className="container mx-auto px-4 py-16" id="chat">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Chat Assistant
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant farming advice and solutions powered by artificial intelligence
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <FontAwesomeIcon icon={faComments} className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat Feature Coming Soon</h3>
            <p className="text-gray-600 mb-6">Our AI-powered chat assistant will help you with farming questions, crop recommendations, and more.</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className=" py-20 bg-gray-50" id="news ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Latest Agricultural News
              </h2>
              <p className="text-lg text-gray-600">
                Stay updated with the latest trends and news in agriculture
              </p>
            </div>
            <Link to="/news" className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold">
              View All <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {!isLoggedIn && LatestNews[0]?.articles?.length > 0 ? (
              LatestNews[0].articles.map((article, index) => (
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
                            {article.source.name}
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
              ))
            ) : isLoggedIn ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <FontAwesomeIcon icon={faGlobe} className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized News Coming Soon</h3>
                  <p className="text-gray-600">Get personalized agricultural news based on your farming practices.</p>
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No news articles available.</p>
              </div>
            )}
          </div>

          <div className="text-center md:hidden">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 inline-flex items-center">
              View All News <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using Krishi Sakhi to optimize their agricultural practices
          </p>
          <button className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
