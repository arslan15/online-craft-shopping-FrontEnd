import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProductCard from '../Components/Product/ProductCard';
import './UserDashboard.css';
import { usePagination } from '../hooks/usePagination';
import MyContext from '../MyContext';
import { 
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaLock, FaUserShield 
} from 'react-icons/fa';

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiPagination, setApiPagination] = useState(null);

  const { handleAddToCart } = useContext(MyContext);

  // Password modal & form states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Initialize generic pagination hook
  const {
    currentItems: displayedProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    clearSearch,
  } = usePagination(products, {
    searchFields: ['productName', 'productCategoryType', 'ProductDescription'],
    initialLimit: 10,
    serverPagination: apiPagination,
  });

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  // Fetch paginated & filtered products from server
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://online-shopping-backend-0kqg.onrender.com/api';
      const token = localStorage.getItem('token');
      const cleanToken = token ? token.replace(/"/g, '') : '';

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${apiUrl}/Products?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchTerm || '')}`,
          {
            headers: cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {},
          }
        );

        const rawData = response.data;

        if (isMounted) {
          if (Array.isArray(rawData)) {
            setProducts(rawData);
          } else if (rawData && Array.isArray(rawData.data)) {
            setProducts(rawData.data);
          } else if (rawData && Array.isArray(rawData.products)) {
            setProducts(rawData.products);
          } else {
            setProducts([]);
          }

          if (rawData?.pagination) {
            setApiPagination(rawData.pagination);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError(
            err.response?.data?.message || 
            'Failed to load products. Check server status.'
          );
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentPage, limit, searchTerm]);

  // Handle Password Input Changes
  const handlePasswordInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Handle Password Submit Request
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    try {
      setPasswordLoading(true);
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://online-shopping-backend-0kqg.onrender.com/api';
      const token = localStorage.getItem('token');
      const cleanToken = token ? token.replace(/"/g, '') : '';

      const response = await axios.put(
        `${apiUrl}/users/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {},
        }
      );

      setPasswordMessage({ type: 'success', text: response.data.message || 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Verify your current password.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const itemsToRender = apiPagination ? products : displayedProducts;

  return (
    <div className="user-dashboard-container">
      
      {/* Top Action Bar: Search Input & Security Button side-by-side */}
      <div className="dashboard-top-bar mb-4" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Search Input Bar */}
        <div className="search-bar-container" style={{ flex: 1, minWidth: '260px', margin: 0 }}>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon-left" />
            <input
              type="text"
              className="dashboard-search-input"
              placeholder="Search clay Pot or canvas by product title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn-clear-search" onClick={clearSearch}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Change Password Trigger Button */}
        <button 
          onClick={() => setShowPasswordModal(true)}
          style={{
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <FaLock style={{ color: '#0d9488' }} /> Change Password
        </button>
      </div>

      {/* Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.65)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#0f172a', color: '#ffffff', padding: '24px', borderRadius: '12px',
            width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)} style={{
              position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none',
              fontSize: '1.5rem', color: '#64748b', cursor: 'pointer'
            }}>
              &times;
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUserShield style={{ color: '#0d9488', fontSize: '1.4rem' }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Change Password</h3>
            </div>

            {passwordMessage.text && (
              <div style={{
                padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem',
                backgroundColor: passwordMessage.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(13, 148, 136, 0.2)',
                color: passwordMessage.type === 'error' ? '#fca5a5' : '#5eead4',
                border: `1px solid ${passwordMessage.type === 'error' ? '#ef4444' : '#0d9488'}`
              }}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#94a3b8' }}>Current Password</label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordInput}
                  required
                  placeholder="Enter current password"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#94a3b8' }}>New Password</label>
                <input 
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordInput}
                  required
                  placeholder="Enter new password"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#94a3b8' }}>Confirm New Password</label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordInput}
                  required
                  placeholder="Confirm new password"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={passwordLoading}
                style={{
                  background: '#0d9488', color: '#fff', border: 'none', padding: '10px',
                  borderRadius: '6px', cursor: passwordLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600', marginTop: '8px', opacity: passwordLoading ? 0.7 : 1
                }}
              >
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid displays items */}
      {loading ? (
        <p className="dashboard-loading">Loading products...</p>
      ) : error ? (
        <p className="dashboard-error">{error}</p>
      ) : (
        <>
          <div className="product-grid">
            {itemsToRender.length > 0 ? (
              itemsToRender.map((product) => {
                let resolvedImageUrl = '';
                if (product.ImageUrl instanceof File) {
                  resolvedImageUrl = URL.createObjectURL(product.ImageUrl);
                } else if (typeof product.ImageUrl === 'string' && product.ImageUrl.length > 0) {
                  resolvedImageUrl = product.ImageUrl;
                } else if (product.imageUrl) {
                  resolvedImageUrl = product.imageUrl;
                } else if (product.image) {
                  if (typeof product.image === 'string') {
                    resolvedImageUrl = product.image;
                  } else if (product.image.data && product.image.contentType) {
                    resolvedImageUrl = `data:${product.image.contentType};base64,${product.image.data}`;
                  }
                }

                return (
                  <ProductCard
                    key={product._id || product.id}
                    productName={product.productName}
                    productCategoryType={product.productCategoryType}
                    ProductQty={product.ProductQty}
                    ProductDescription={product.ProductDescription}
                    price={product.price}
                    imageUrl={resolvedImageUrl}
                    ImageUrl={resolvedImageUrl} 
                    onAddToCart={() => handleAddToCart(product)}
                  />
                );
              })
            ) : (
              <p className="no-products-found">
                {searchTerm 
                  ? `No items found matching "${searchTerm}"` 
                  : 'No products available at the moment.'}
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          <div
            className="pagination-wrapper"
            style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  padding: '6px 12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <FaChevronLeft className="btn-icon" /> Previous
              </button>

              <div
                className="page-indicator"
                style={{
                  padding: '6px 10px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                </span>
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  padding: '6px 12px',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Next <FaChevronRight className="btn-icon" />
              </button>
            </div>

            <div
              className="items-per-page-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <label htmlFor="limit-select" style={{ marginRight: '6px' }}>
                Show:
              </label>
              <select
                id="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="items-per-page-select"
                style={{ padding: '4px 8px', borderRadius: '4px' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;