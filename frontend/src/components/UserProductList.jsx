import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserCarCard from "./UserCarCard";
import Skeleton from "./Skeleton";
import { FaCarSide, FaShieldAlt, FaHandshake, FaAward } from "react-icons/fa";

const BASE_URL = "http://localhost:4000";
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1280&h=720';

const UserProducts = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(true);
  const location = useLocation();
  const array = new Array(6).fill(0);

  const color = searchParams.get("colors");
  const price = searchParams.get("price");
  const mileage = searchParams.get("mileage");

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (color) queryParams.append('color', color);
        if (price) queryParams.append('price', price);
        if (mileage) queryParams.append('mileage', mileage);

        const response = await axios.get(`${BASE_URL}/cars/public/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
        console.log('Cars response:', response.data);
        
        if (response.data.status === 'success') {
          setCars(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch cars');
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(`Failed to load cars: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
    fetchCars();
  }, [color, price, mileage, location.search]);

  if (error) {
    return (
      <DIV>
        <div className="error-message">
          <h2>Error Loading Cars</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </DIV>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <DIV>
        <div className="no-results">
          <h2>No Cars Found</h2>
          <p>Try adjusting your filters or check back later for new listings.</p>
          <Link to="/users-car" className="reset-link">Reset Filters</Link>
        </div>
      </DIV>
    );
  }

  return (
    <DIV>
      <div className="catalogue-header">
        <div className="header-content">
          <div className="brand">
            <FaCarSide className="car-icon" />
            <h1>Premium Car Collection</h1>
            <p>Discover Your Perfect Drive</p>
          </div>
          <div className="trust-badges">
            <div className="badge">
              <FaShieldAlt />
              <span>Verified Dealers</span>
            </div>
            <div className="badge">
              <FaHandshake />
              <span>Secure Deals</span>
            </div>
            <div className="badge">
              <FaAward />
              <span>Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loaders">
          {array.map((_, i) => (
            <LOADING key={i}>
              <div className="skel_div">
                <Skeleton width={"100%"} height={"280px"} borderradius={"0"} />
                <div className="textload">
                  <Skeleton width={"70%"} height={"24px"} />
                  <Skeleton width={"40%"} height={"20px"} />
                </div>
              </div>
            </LOADING>
          ))}
        </div>
      ) : isAuth ? (
        <>
          <div className="catalogue-filters">
            <div className="active-filters">
              {color && <span className="filter-tag">Color: {color}</span>}
              {price && (
                <span className="filter-tag">
                  Price: {price === 'asc' ? '↑' : '↓'}
                </span>
              )}
              {mileage && (
                <span className="filter-tag">
                  Mileage: {mileage === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
            <div className="results-count">
              {cars.length} Premium Vehicles
            </div>
          </div>

          <div className="products">
            {cars.map((car) => (
              <UserCarCard key={car._id} {...car} />
            ))}
          </div>
        </>
      ) : (
        <div className="auth-prompt">
          <h2>Please Login to View Cars</h2>
          <Link to="/login">
            <button>Login Now</button>
          </Link>
        </div>
      )}
    </DIV>
  );
};

export default UserProducts;

const DIV = styled.div`
  .catalogue-header {
    background: linear-gradient(to right, #2c5282, #4299e1);
    color: white;
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    text-align: center;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;

      .brand {
        margin-bottom: 1.5rem;

        .car-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
      }

      .trust-badges {
        display: flex;
        justify-content: center;
        gap: 2rem;

        .badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;

          svg {
            font-size: 1.5rem;
          }

          span {
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  .catalogue-filters {
    max-width: 1200px;
    margin: 0 auto 2rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .active-filters {
      display: flex;
      gap: 1rem;

      .filter-tag {
        background: #e2e8f0;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        color: #2d3748;
      }
    }

    .results-count {
      color: #4a5568;
      font-weight: 500;
    }
  }

  .products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .error-message, .no-results, .auth-prompt {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 2rem auto;

    h2 {
      color: #2c5282;
      margin-bottom: 1rem;
    }

    p {
      color: #4a5568;
      margin-bottom: 1.5rem;
    }

    button, .reset-link {
      background: #4299e1;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: background 0.2s;

      &:hover {
        background: #2b6cb0;
      }
    }
  }

  .loaders {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const LOADING = styled.div`
  .skel_div {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .textload {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;
