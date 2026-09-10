import React, { useState } from 'react';
import { FaPaintBrush, FaExternalLinkAlt, FaSearch, FaPalette, FaFolderOpen } from 'react-icons/fa';
import { usePagination } from '../../hooks/usePagination'; // Path to your custom hook file
import './Portfolio.css';

const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "Hand-Thrown Terracotta Planters",
    category: "Pottery & Clay",
    description: "Custom-shaped unglazed clay pots designed for indoor flora, featuring hand-carved geometric patterns and natural breathable finishes.",
    tags: ["Terracotta", "Pottery", "Handmade", "Sculpting"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: 2,
    title: "Abstract Sunset Canvas Masterpiece",
    category: "Canvas Painting",
    description: "Large-scale acrylic-on-canvas painting capturing warm evening horizons with textured brushwork and rich golden gradients.",
    tags: ["Acrylic", "Canvas Art", "Textured", "Modern Art"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: 3,
    title: "Glazed Ceramic Vase Collection",
    category: "Pottery & Clay",
    description: "Kiln-fired ceramic vases finished with custom reactive glazes, offering vibrant cobalt-blue drips and waterproof durability.",
    tags: ["Ceramics", "Glazing", "Kiln Fired", "Home Decor"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: 4,
    title: "Botanical Floral Canvas Series",
    category: "Canvas Painting",
    description: "A series of delicate botanical studies rendered in oil on stretched cotton canvas, highlighting native wildflowers and foliage.",
    tags: ["Oil Painting", "Botanical", "Canvas", "Fine Art"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  }
];

const CATEGORIES = ["All", "Pottery & Clay", "Canvas Painting"];

function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Filter by category first before feeding into usePagination
  const categoryFilteredProjects = PORTFOLIO_PROJECTS.filter((project) => {
    return selectedCategory === "All" || project.category === selectedCategory;
  });

  // 2. Pass category-filtered list into your custom usePagination hook
  const {
    currentItems: displayedProjects,
    currentPage,
    setCurrentPage,
    totalPages,
    limit,
    setLimit,
    searchTerm,
    handleSearchChange,
    clearSearch,
  } = usePagination(categoryFilteredProjects, {
    searchFields: ['title', 'description', 'tags'], // Hook searches titles, descriptions, and tags automatically
    initialLimit: 4, 
  });

  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        
        {/* Header Section */}
        <div className="portfolio-header">
          <span className="portfolio-badge">
            <FaFolderOpen /> Gallery & Collections
          </span>
          <h1 className="portfolio-title">Canvas & Clay Artworks</h1>
          <p className="portfolio-subtitle">
            Explore our handcrafted pottery designs, custom clay sculpts, and expressive canvas paintings.
          </p>
        </div>

        {/* Filters and Search Bar Toolbar */}
        <div className="portfolio-toolbar">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1); // Reset page on category switch
                }}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search pots, canvas art, or styles..."
              value={searchTerm}
              onChange={handleSearchChange} // Uses your hook's safe handler
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => (
              <div key={project.id} className="project-card-glass">
                <div className="project-card-body">
                  
                  {/* Category Header Badge */}
                  <div className="project-card-top">
                    <span className="project-category-badge">
                      {project.category}
                    </span>
                    <FaPalette className="layer-icon" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">
                    {project.description}
                  </p>

                  {/* Material & Style Tags */}
                  <div className="project-tags">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="project-card-footer">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-subtle"
                  >
                    <FaPaintBrush /> View Details
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-purple-glow"
                  >
                    <FaExternalLinkAlt size={12} /> Gallery View
                  </a>
                </div>

              </div>
            ))
          ) : (
            <div className="no-projects-found">
              <h5>No pieces found matching "{searchTerm}".</h5>
            </div>
          )}
        </div>

        {/* Simple Pagination Footer Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center gap-2">
            <button 
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-muted mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Portfolio;