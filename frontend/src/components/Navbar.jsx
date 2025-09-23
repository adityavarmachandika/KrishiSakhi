import React, { useEffect, useState } from 'react';
import { navLinks } from '../constants';
import { Menu, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}>
        <div className="inner">
          <a href="#hero" className="logo">
           <FontAwesomeIcon icon={faLeaf} size="lg" color="#365949" /> Krishi Sakhi
          </a>

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

          <a href="#contact" className="contact-btn group">
            <div className="inner">
              <span>Contact Me</span>
            </div>
          </a>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-md"
          >
            {isMenuOpen ? <X size={24} color='black' /> : <Menu size={24}  color='black'/>}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-[70px] left-0 right-0 z-50 bg-black text-white shadow-lg md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          {navLinks.map(({ link, name }, index) => (
            <a
              key={name}
              href={link}
              onClick={toggleMenu}
              className={`text-lg font-medium transform transition-all duration-300 ease-out ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {name}
            </a>
          ))}
          
         <a href="#contact" className="contact-btn group transition-all duration-300"  onClick={toggleMenu}>
            <div className="inner">
              <span>Contact Me</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
