import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedin, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', path: '/' },
      { name: 'Activity Logging', path: '/activity-logging' },
      { name: 'Crop Details', path: '/crop-details' },
      { name: 'AI Chat', path: '/chat' },
    ],
    resources: [
      { name: 'Weather Updates', path: '/weather' },
      { name: 'Market News', path: '/news' },
      { name: 'Farming Tips', path: '/' },
    ],
    support: [
      { name: 'Help Center', path: '/' },
      { name: 'Contact Us', path: '/' },
      { name: 'FAQs', path: '/' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/' },
      { name: 'Terms of Service', path: '/' },
    ]
  };


  return (
    <footer className="bg-[#365949] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
          
          {/* Brand & Description - Takes 2 columns on xl screens */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faLeaf} className="text-[#365949] text-xl" />
              </div>
              <h3 className="text-2xl font-bold">KrishiSakhi</h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed mb-6 max-w-md">
              Empowering farmers with AI-driven insights, real-time monitoring, and smart agricultural solutions. 
              Your trusted companion for modern farming success.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-green-100 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-green-300" />
                <span>support@krishisakhi.com</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-200">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-green-100 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-200">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-green-100 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-200">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-green-100 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-200">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-green-100 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-green-400/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="max-w-md">
              <h4 className="text-lg font-semibold mb-2 text-green-200">Stay Updated</h4>
              <p className="text-green-100 text-sm">
                Get the latest farming insights, weather updates, and agricultural news delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent backdrop-blur-sm"
              />
              <button className="bg-green-300 hover:bg-green-200 text-[#365949] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#2d4a3a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="text-green-100 text-sm">
              <p>&copy; {currentYear} KrishiSakhi. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              
            </div>

            {/* Additional Info */}
            <div className="text-green-100 text-xs">
              <span>Made with </span>
              <FontAwesomeIcon icon={faLeaf} className="text-green-300 mx-1" />
              <span> for farmers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
