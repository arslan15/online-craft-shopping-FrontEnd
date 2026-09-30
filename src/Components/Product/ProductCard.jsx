import React, { useState } from 'react';
import "./ProductCard.css";

const ProductCard = (props) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // Unified image source check (handles both casing variations for card & modal)
  const imageSource = props.imageUrl || props.ImageUrl || props.image?.data?.$binary?.base64; // Fallback for nested image binary if needed

  // Unified description check
  const description = props.ProductDescription || props.productDescription;

  // Stock Validation Check
  const stockCount = Number(props.ProductQty) || 0;
  const isOutOfStock = stockCount <= 0;

  // Fixed Discount Price Check (uses props.discountPrice directly)
  const hasDiscount = 
    props.discountPrice !== null && 
    props.discountPrice !== undefined && 
    props.discountPrice !== '' && 
    Number(props.discountPrice) < Number(props.price);

  const handleAddToCartClick = (e) => {
    if (e) e.stopPropagation();
    if (isOutOfStock) return;
    if (props.onAddToCart) props.onAddToCart();
  };

  return (
    <>
      {/* Main Product Card */}
      <div className="product-card">
        {imageSource && (
          <div className="product-image-container">
            <img 
              src={imageSource} 
              alt={props.productName || "Product"} 
              className="product-image" 
            />
          </div>
        )}

        <div className="product-content">
          {props.productCategoryType && (
            <span className="product-category">
              {props.productCategoryType}
            </span>
          )}

          <h3 className="product-title">{props.productName}</h3>
          
          {props.price && (
            <div className="product-pricing" style={{ margin: '8px 0' }}>
              {hasDiscount ? (
                <>
                  <span className="original-price" style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '8px', fontSize: '14px' }}>
                    Rs. {props.price}
                  </span>
                  <span className="discount-price" style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '16px' }}>
                    Rs. {props.discountPrice}
                  </span>
                </>
              ) : (
                <span className="regular-price" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Price: Rs. {props.price}
                </span>
              )}
            </div>
          )}

          <p className="product-qty">
            {isOutOfStock ? (
              <span className="out-of-stock-label" style={{ color: '#ef4444', fontWeight: 'bold' }}>
                Out of Stock
              </span>
            ) : (
              <span>Stock: {stockCount}</span>
            )}
          </p>

          <div className="button-group">
            <button className="prodButton detailsBtn" onClick={toggleModal}>
              Details
            </button>
            <button 
              className={`prodButton cartBtn ${isOutOfStock ? 'disabled-btn' : ''}`} 
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              style={{
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                backgroundColor: isOutOfStock ? '#64748b' : undefined
              }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={toggleModal}>
              &times;
            </button>

            {imageSource && (
              <img 
                src={imageSource} 
                alt={props.productName || "Product"} 
                className="modal-product-image" 
              />
            )}

            {props.productCategoryType && (
              <span className="product-category">{props.productCategoryType}</span>
            )}
            
            <h2 className="modal-title">{props.productName}</h2>
            
            <p className="modal-description">
              {description || "No detailed description provided for this product."}
            </p>

            <div className="modal-meta">
              <p>
                <strong>Stock Available:</strong>{' '}
                {isOutOfStock ? (
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Out of Stock</span>
                ) : (
                  stockCount
                )}
              </p>
              {props.price && (
                <div className="modal-pricing">
                  {hasDiscount ? (
                    <h3>
                      Price: <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '8px' }}>Rs. {props.price}</span>
                      <span style={{ color: '#ef4444' }}>Rs. {props.discountPrice}</span>
                    </h3>
                  ) : (
                    <h3>Price: Rs. {props.price}</h3>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className={`prodButton cartBtn ${isOutOfStock ? 'disabled-btn' : ''}`}
                disabled={isOutOfStock}
                onClick={() => {
                  handleAddToCartClick();
                  if (!isOutOfStock) toggleModal();
                }}
                style={{
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  backgroundColor: isOutOfStock ? '#64748b' : undefined
                }}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add To Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;