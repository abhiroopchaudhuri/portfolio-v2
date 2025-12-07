import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null); // Ref for search container
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // If clicked outside AND search term is empty, contract
        if (searchTerm.trim() === '') {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Smart Hide/Show Logic
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Scrolling down & not at top -> Hide

        // Auto-Contract if Navbar hides and search is empty
        if (searchTerm.trim() === '') {
          setIsSearchOpen(false);
        }
      } else {
        setIsVisible(true);  // Scrolling up or at top -> Show
      }

      // Frosted Effect Logic
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, searchTerm]);

  // Search Logic
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);

    // Clear previous highlights
    const marks = document.querySelectorAll('mark.highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });

    if (!term.trim()) return;

    const regex = new RegExp(`(${term})`, 'gi');
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip scripts, styles, and the search input itself
          if (node.parentElement.tagName === 'SCRIPT' ||
            node.parentElement.tagName === 'STYLE' ||
            node.parentElement.tagName === 'MARK' ||
            node.parentElement.closest('.search-container')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.match(regex)) {
        textNodes.push(node);
      }
    }

    let firstMatch = true;
    textNodes.forEach(textNode => {
      const fragment = document.createDocumentFragment();
      const parts = textNode.nodeValue.split(regex);

      parts.forEach(part => {
        if (part.toLowerCase() === term.toLowerCase()) {
          const mark = document.createElement('mark');
          mark.className = 'highlight bg-[var(--accent-color)] text-white px-1 rounded-sm';
          mark.textContent = part;
          fragment.appendChild(mark);

          if (firstMatch) {
            setTimeout(() => {
              mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            firstMatch = false;
          }
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    handleSearch('');
    // Keep input focused? Or just clear. User didn't specify focus behavior, but clearing text is key.
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const linkHover = {
    scale: 1.05,
    color: "var(--accent-color)",
    transition: { duration: 0.2 }
  };

  return (
    <motion.nav
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      variants={navVariants}
      className={`fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 transition-all duration-500 ${isScrolled
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
        }`}
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'none', // Enhanced blur for "liquify" feel
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none'
      }}
    >
      <div className="flex items-center gap-8">
        {/* Back Button (Conditional) */}
        <AnimatePresence>
          {location.pathname !== '/' && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate('/')}
              className="text-white font-bold text-sm tracking-widest hover:text-[var(--accent-color)] transition-colors mix-blend-difference"
            >
              ← BACK
            </motion.button>
          )}
        </AnimatePresence>

        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="flex flex-col leading-none font-bold text-xl tracking-tighter text-white mix-blend-difference">
            <span className="group-hover:text-[var(--accent-color)] transition-colors duration-300">ABHIROOP</span>
            <span className="group-hover:text-[var(--accent-secondary)] transition-colors duration-300 delay-75">CHAUDHURI</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Links + Search */}
      <div className="flex items-center gap-8">
        {/* Links */}
        <div className="hidden md:flex gap-8 font-medium text-sm uppercase tracking-widest text-white mix-blend-difference">
          {['Github', 'Behance', 'LinkedIn'].map((item) => (
            <motion.a
              key={item}
              variants={itemVariants}
              whileHover={linkHover}
              href={
                item === 'Github' ? "https://github.com/abhiroopchaudhuri" :
                  item === 'Behance' ? "https://www.behance.net/abhiroopchaudhuri" :
                    "https://www.linkedin.com/in/abhiroopchaudhuri"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden"
            >
              {item}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--accent-color)]"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="search-container relative" ref={searchRef}>
          <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20' : 'w-10 h-10 justify-center'}`}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-[var(--accent-color)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center w-full"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    className="bg-transparent border-none outline-none text-white ml-2 w-full text-sm placeholder-gray-400"
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                  />
                  {/* Clear Button (X) */}
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
