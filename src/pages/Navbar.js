import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faInfoCircle, faEnvelope, faQuestionCircle, faBlog } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // Importing the toast context
import "./css/Navbar.css";
import logo from "../img/logo.png";
import { faServicestack } from '@fortawesome/free-brands-svg-icons';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const { showToast } = useToast(); // Using the toast context
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname); // Initialize activePath with the current path
  const sideNavRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState); // Correctly toggle the state
  };

  // Update activePath whenever the location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Close sidebar if click is outside the side nav (mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close sidebar if click is outside of the sidebar and the hamburger button
      if (
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target) &&
        !event.target.closest(".hamburger") &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Add isOpen as a dependency to close when it's open

  const handleNavClick = (path) => {
    setActivePath(path);
    if (isOpen) setIsOpen(false); // Close sidebar after clicking a navigation item (for mobile)
  };

  const handleLogout = () => {
    logout();
    showToast('You have logged out successfully!', 'success'); // Show success toast on logout
  };

  return (
    <div>
      {/* Header Section */}
      <header>
        <div className="logo">
          <Link to="/"><img src={logo} alt='' className='logo-img' />Sentiment</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-link ${activePath === "/" ? "active" : ""}`}
                onClick={() => handleNavClick("/")}
              >
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`nav-link ${activePath === "/profile" ? "active" : ""}`}
                onClick={() => handleNavClick("/profile")}
              >
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${activePath === "/about" ? "active" : ""}`}
                onClick={() => handleNavClick("/about")}
              >
                <FontAwesomeIcon icon={faInfoCircle} /> About Us
              </Link>
            </li>
            <li>
              <Link
                to="/#services"
                className={`nav-link ${activePath === "/services" ? "active" : ""}`}
                onClick={() => handleNavClick("/services")}
              >
                <FontAwesomeIcon icon={faServicestack} /> Services
              </Link>
            </li>
            <li>
                <Link
                  to="/docs"
                  className={`nav-link ${activePath === "/docs" ? "active" : ""}`}
                  onClick={() => handleNavClick("/docs")}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> Docs
                </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`nav-link ${activePath === "/blog" ? "active" : ""}`}
                onClick={() => handleNavClick("/blog")}
              >
                <FontAwesomeIcon icon={faBlog} /> Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`nav-link ${activePath === "/contact" ? "active" : ""}`}
                onClick={() => handleNavClick("/contact")}
              >
                <FontAwesomeIcon icon={faEnvelope} /> Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                className={`nav-link ${activePath === "/faqs" ? "active" : ""}`}
                onClick={() => handleNavClick("/faqs")}
              >
                <FontAwesomeIcon icon={faQuestionCircle} /> FAQs
              </Link>
            </li>
            {token ? (
              <li>
                <button onClick={handleLogout} className="nav-link btn btn">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="btn btn"
                >
                  Login/SignUp
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Hamburger Icon (Mobile) */}
        <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </header>

      {/* Side Navigation (Mobile) */}
      <nav ref={sideNavRef} className={`side-nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/"
              className={`nav-link ${activePath === "/" ? "active" : ""}`}
              onClick={() => handleNavClick("/")}
            >
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`nav-link ${activePath === "/profile" ? "active" : ""}`}
              onClick={() => handleNavClick("/profile")}
            >
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`nav-link ${activePath === "/about" ? "active" : ""}`}
              onClick={() => handleNavClick("/about")}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> About Us
            </Link>
          </li>
          <li>
              <Link
                to="/#services"
                className={`nav-link ${activePath === "/services" ? "active" : ""}`}
                onClick={() => handleNavClick("/services")}
              >
                <FontAwesomeIcon icon={faServicestack} /> Services
              </Link>
          </li>
          <li>
                <Link
                  to="/docs"
                  className={`nav-link ${activePath === "/docs" ? "active" : ""}`}
                  onClick={() => handleNavClick("/docs")}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> Docs
                </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`nav-link ${activePath === "/blog" ? "active" : ""}`}
                onClick={() => handleNavClick("/blog")}
              >
                <FontAwesomeIcon icon={faBlog} /> Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`nav-link ${activePath === "/contact" ? "active" : ""}`}
                onClick={() => handleNavClick("/contact")}
              >
                <FontAwesomeIcon icon={faEnvelope} /> Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                className={`nav-link ${activePath === "/faqs" ? "active" : ""}`}
                onClick={() => handleNavClick("/faqs")}
              >
                <FontAwesomeIcon icon={faQuestionCircle} /> FAQs
              </Link>
            </li>

          {token ? (
            <li>
              <button onClick={handleLogout} className="nav-link btn btn">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className={`btn btn nav-link ${activePath === "/login" ? "active" : ""}`}
                onClick={() => handleNavClick("/login")}
              >
                Login/SignUp
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
