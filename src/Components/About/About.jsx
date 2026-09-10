import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPaintBrush, 
  FaPalette, 
  FaStore, 
  FaRocket, 
  FaHeart, 
  FaGift, 
  FaHands,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import './About.css';

function About() {
  const craftHighlights = [
    { name: 'Hand-Thrown Clay Pots', icon: FaHands, level: 'Crafted with Love', color: '#c084fc' },
    { name: 'Custom Canvas Art', icon: FaPaintBrush, level: 'Original Pieces', color: '#38bdf8' },
    { name: 'Eco-Friendly Glazes', icon: FaPalette, level: 'Natural Finishes', color: '#f97316' },
    { name: 'Unique Home Decor', icon: FaGift, level: 'Small Batch', color: '#facc15' },
  ];

  const stats = [
    { label: 'Shop Launch', value: 'New' },
    { label: 'Pots Shaped', value: '100+' },
    { label: 'Canvases Painted', value: '50+' },
    { label: 'Happy First Buyers', value: '25+' },
  ];

  return (
    <div className="about-page">
      <div className="about-container">

        {/* Hero Banner Section */}
        <div className="about-hero-grid">
          <div className="hero-content">
            <span className="hero-badge">
              <FaCheckCircle className="badge-icon" /> Welcome To My Little Shop
            </span>
            <h1 className="hero-title">
              Turning Raw Clay & Canvas Into <span className="gradient-text">Handmade Treasures</span>
            </h1>
            <p className="hero-subtitle">
              Hi there! I recently started this small independent shop to share my love for pottery and painting. Every single clay pot is hand-thrown and every canvas is painted right from my home studio just for you.
            </p>
            <div className="hero-actions">
              <Link to="/portfolio" className="btn-primary-gradient">
                <span>Browse Shop Collection</span>
                <FaArrowRight size={14} />
              </Link>
              <Link to="/contact" className="btn-secondary-glass">
                Request Custom Order
              </Link>
            </div>
          </div>

          <div className="hero-card-side">
            <div className="glass-feature-card">
              <div className="rocket-glow-icon">
                <FaStore />
              </div>
              <h4>100% Handmade</h4>
              <p>
                No mass production here! Every piece has its own unique character, shaped and glazed with personal care.
              </p>
            </div>
          </div>
        </div>

        {/* Key Statistics Bar */}
        <div className="stats-bar-glass">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* What I Make */}
        <div className="about-section">
          <div className="section-header">
            <h2>What’s in the Shop</h2>
            <p>A peek into the craft pieces available in my collection</p>
          </div>

          <div className="skills-grid">
            {craftHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="skill-card-glass">
                  <div className="skill-icon-badge" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                    <Icon />
                  </div>
                  <h5 className="skill-title">{item.name}</h5>
                  <span className="skill-level-pill">{item.level}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Values / Shop Promise */}
        <div className="about-section">
          <div className="section-header">
            <h2>My Shop Promise</h2>
            <p>The values behind every piece packed and shipped from my studio</p>
          </div>

          <div className="values-grid">
            <div className="value-card-glass">
              <div className="value-icon-wrapper purple">
                <FaHeart />
              </div>
              <h4>Made With Passion</h4>
              <p>
                As a beginner creator turning a dream into reality, I pour genuine love and attention into every brushstroke and clay spin.
              </p>
            </div>

            <div className="value-card-glass">
              <div className="value-icon-wrapper green">
                <FaStore />
              </div>
              <h4>Small Batch Quality</h4>
              <p>
                I create items in small batches to ensure absolute quality control, making each piece you buy truly one-of-a-kind.
              </p>
            </div>

            <div className="value-card-glass">
              <div className="value-icon-wrapper yellow">
                <FaRocket />
              </div>
              <h4>Growing Together</h4>
              <p>
                Thank you for supporting a new independent maker! Your feedback and purchases help this tiny creative dream grow.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;