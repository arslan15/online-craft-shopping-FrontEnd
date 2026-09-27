import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  FaUser, 
  FaBriefcase, 
  FaEnvelope, 
  FaBars, 
  FaTimes, 
  FaSignInAlt, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaShoppingCart,
  FaBell 
} from 'react-icons/fa';
import CraftLogo from '../../CraftLogo.jsx';
import './Header.css';

// User navigation links
const USER_NAV_ITEMS = [
  { path: '/user', label: 'Dashboard', icon: FaTachometerAlt },
  { path: '/about', label: 'About', icon: FaUser },
  { path: '/portfolio', label: 'Portfolio', icon: FaBriefcase },
  { path: '/contact', label: 'Contact', icon: FaEnvelope },
];

const GUEST_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: FaTachometerAlt },
  { path: '/about', label: 'About', icon: FaUser },
  { path: '/portfolio', label: 'Portfolio', icon: FaBriefcase },
  { path: '/contact', label: 'Contact', icon: FaEnvelope },
];

// Admin navigation links
const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { path: '/about', label: 'About', icon: FaUser },
  { path: '/portfolio', label: 'Portfolio', icon: FaBriefcase },
  { path: '/contact', label: 'Contact', icon: FaEnvelope },
];

function Header({ companyName = "Craft Company", isLoggedIn = false, isAdmin = false, isUser = false, cartCount = 0, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const headerRef = useRef(null);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogoutClick = () => {
    closeMenu();
    if (onLogout) onLogout();
  };

  // Socket.io setup for Admin notifications
  useEffect(() => {
    if (!isAdmin) return; 

    const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
    const socket = io(API_URL); 
    fetch(`${API_URL}/api/admin/notifications/unread-count`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAdminUnreadCount(data.unreadCount);
      })
      .catch((err) => console.error("Failed to load unread count:", err));

    // Listen for live broadcast when a new contact form comes in
    socket.on('updateNotificationCount', (data) => {
      setAdminUnreadCount(data.unreadCount);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  // Close mobile menu when clicking outside header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = isAdmin 
    ? ADMIN_NAV_ITEMS 
    : isUser 
      ? USER_NAV_ITEMS 
      : GUEST_NAV_ITEMS;

  const brandLink = isAdmin ? '/admin' : isUser ? '/user' : '/';

  return (
    <header className="header" ref={headerRef}>
      <div className="header-container">
        {/* Dynamic Brand / Logo */}
        <Link to={brandLink} className="logo" onClick={closeMenu} aria-label="Home">
          <div className="logo-icon-wrapper">
            <CraftLogo size={36} color="#d97706" />
          </div>
          <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2', marginLeft: '10px' }}>
            <span className="logo-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>
              <span className="brand-primary" style={{ color: '#f3f4f6' }}>Syed Arslan</span>{' '}
              <span className="brand-secondary" style={{ color: '#d97706' }}>Saeed</span>
            </span>
            <span className="logo-subtitle" style={{ fontSize: '11px', color: '#d1d5db', letterSpacing: '0.5px' }}>
              Handcrafted Artistry
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation Menu */}
        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} aria-label="Main Navigation">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/' || path === '/admin' || path === '/user'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Icon className="nav-icon" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Render Admin-Only Messages/Notification Icon with Badge */}
          {isAdmin && (
            <NavLink
              to="/admin/messages"
              className={({ isActive }) => `nav-link cart-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              aria-label={`Admin Messages with ${adminUnreadCount} unread items`}
            >
              <div className="cart-icon-wrapper" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <FaBell className="nav-icon" aria-hidden="true" />
                {adminUnreadCount > 0 && (
                  <span className="cart-badge" style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '50%',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {adminUnreadCount > 99 ? '99+' : adminUnreadCount}
                  </span>
                )}
              </div>
              <span style={{ marginLeft: '6px' }}>Messages</span>
            </NavLink>
          )}

          {/* Render Cart link with Badge Counter exclusively for 'isUser' */}
          {isUser && (
            <NavLink
              to="/cart"
              className={({ isActive }) => `nav-link cart-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <div className="cart-icon-wrapper">
                <FaShoppingCart className="nav-icon" aria-hidden="true" />
                {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </div>
              <span>Cart</span>
            </NavLink>
          )}

          {/* Conditional Login / Logout Button */}
          {isLoggedIn ? (
            <button className="auth-btn logout-btn" onClick={handleLogoutClick} aria-label="Log Out">
              <FaSignOutAlt className="nav-icon" aria-hidden="true" />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className="login-btn" 
              onClick={closeMenu}
              aria-label="Log In"
            >
              <FaSignInAlt className="nav-icon" aria-hidden="true" />
              <span>Login</span>
            </NavLink>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle" 
          onClick={toggleMenu} 
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Header;