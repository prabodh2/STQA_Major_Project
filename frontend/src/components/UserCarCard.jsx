import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Default car images by brand (extracted from title)
const DEFAULT_IMAGES = {
  'Honda': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1280&h=720',
  'Toyota': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1280&h=720',
  'Hyundai': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1280&h=720',
  'default': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1280&h=720'
};

const UserCarCard = ({ 
  _id,
  title,
  image,
  price,
  mileage = 0,
  colors = [],
  description = ''
}) => {
  const [displayImage, setDisplayImage] = useState(image);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (km) => {
    return new Intl.NumberFormat('en-IN').format(km);
  };

  const getBrandFromTitle = (title) => {
    const brand = Object.keys(DEFAULT_IMAGES).find(brand => 
      title.toLowerCase().includes(brand.toLowerCase())
    );
    return brand || 'default';
  };

  const handleImageError = () => {
    const brand = getBrandFromTitle(title);
    const fallbackImage = DEFAULT_IMAGES[brand];
    
    if (displayImage !== fallbackImage) {
      setDisplayImage(fallbackImage);
    }
  };

  return (
    <DIV>
      <div className="premium-card">
        <div className="image-wrapper">
          <img 
            src={displayImage} 
            alt={title}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="price-tag">{formatPrice(price)}</div>
          <div className="quality-badge">
            <span>Premium</span>
          </div>
        </div>
        <div className="car-details">
          <h3>{title}</h3>
          <div className="specs">
            <div className="spec">
              <span className="label">Mileage:</span>
              <span className="value">{formatMileage(mileage)} km</span>
            </div>
            {colors?.length > 0 && (
              <div className="spec">
                <span className="label">Colors:</span>
                <span className="value">{colors.join(", ")}</span>
              </div>
            )}
          </div>
          {description && <p className="description">{description}</p>}
          <Link to={`/car/${_id}`} className="view-details">
            View Details
          </Link>
        </div>
      </div>
    </DIV>
  );
};

const DIV = styled.div`
  .premium-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);

      .image-wrapper img {
        transform: scale(1.05);
      }
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }

      .price-tag {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: 600;
      }

      .quality-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(44, 82, 130, 0.9);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }
    }

    .car-details {
      padding: 1.5rem;

      h3 {
        margin: 0 0 1rem;
        color: #2d3748;
        font-size: 1.25rem;
      }

      .specs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;

        .spec {
          display: flex;
          justify-content: space-between;
          color: #4a5568;
          font-size: 0.9rem;

          .label {
            font-weight: 500;
          }

          .value {
            color: #718096;
          }
        }
      }

      .description {
        color: #4a5568;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.5;
      }

      .view-details {
        display: inline-block;
        background: #4299e1;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        text-decoration: none;
        transition: background 0.2s;

        &:hover {
          background: #2b6cb0;
        }
      }
    }
  }
`;

export default UserCarCard;
