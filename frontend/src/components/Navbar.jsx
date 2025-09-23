import React, { useEffect, useState } from 'react';
import { navLinks } from '../constants';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    console.log('Login clicked');
    setIsLoggedIn(true);
    setIsMenuOpen(false);
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
    setIsLoggedIn(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
        <div className="inner">
                
        <Link to="/" className="logo">
         <FontAwesomeIcon icon={faLeaf} size="lg" color="#365949" /> Krishi Sakhi
         </Link>

          {/* Desktop Nav */}
          <nav className="desktop">
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name} className="group">
                  <a href={link}>
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth/Contact Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <button 
                    className="px-4 py-2 border-2 border-[#365949] text-[#365949] rounded-lg hover:bg-[#365949] hover:text-white transition-colors duration-300 font-medium"
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button 
                    className="px-5 py-2 bg-[#365949] text-white rounded-lg hover:bg-[#2a4236] transition-colors duration-300 font-medium"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.href = '#contact'}
                  className="px-5 py-2 bg-[#365949] text-white rounded-lg hover:bg-[#2a4236] transition-colors duration-300 font-medium"
                >
                  Contact Us
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-300 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} color="black" /> : <Menu size={24} color="black" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-[70px] left-0 right-0 z-50 bg-black text-white shadow-lg lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          {navLinks.map(({ link, name }, index) => (
            <a
              key={name}
              href={link}
              onClick={handleNavLinkClick}
              className={`text-lg font-medium transform transition-all duration-300 ease-out hover:text-gray-300 ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {name}
            </a>
          ))}
          
          {/* Mobile Auth/Contact Buttons */}
          {!isLoggedIn ? (
            <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gray-600 w-full max-w-xs">
              <Link to="/login" className="w-full">
                <button 
                  className="w-full py-2 px-6 border-2 border-[#365949] text-[#365949] rounded-lg font-medium hover:bg-[#365949] hover:text-white transition-colors duration-300"
                >
                  Login
                </button>
              </Link>
              <Link to="/register" className="w-full">
                <button 
                  className="w-full py-2 px-6 bg-[#365949] text-white rounded-lg font-medium hover:bg-[#2a4236] transition-colors duration-300"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gray-600 w-full max-w-xs">
              <button 
                onClick={() => window.location.href = '#contact'}
                className="w-full text-center bg-[#365949] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2a4236] transition-colors duration-300"
              >
                Contact Us
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-2 px-6 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
