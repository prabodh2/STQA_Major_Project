import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaCar, FaTachometerAlt, FaPaintBrush, FaHistory, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:4000";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .loading, .error {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .car-details {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .header {
      padding: 2rem;
      background: linear-gradient(to right, #2c5282, #4299e1);
      color: white;

      h1 {
        margin: 1rem 0;
        font-size: 2rem;
      }

      .dealer-info {
        opacity: 0.9;
      }
    }

    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .image-section {
      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .info-section {
      .price-tag {
        font-size: 2rem;
        font-weight: bold;
        color: #2c5282;
        margin-bottom: 1.5rem;
      }

      .description {
        margin-bottom: 2rem;
        
        h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        p {
          color: #4a5568;
          line-height: 1.6;
        }
      }

      .specs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;

        .spec-item {
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;

          svg {
            font-size: 1.5rem;
            color: #4299e1;
            margin-bottom: 0.5rem;
          }

          h4 {
            color: #2d3748;
            margin-bottom: 0.5rem;
          }

          p {
            color: #4a5568;
          }

          ul {
            list-style: none;
            padding: 0;
            color: #4a5568;

            li {
              margin-bottom: 0.25rem;
            }
          }

          .colors-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .color-tag {
              background: #e2e8f0;
              padding: 0.25rem 0.75rem;
              border-radius: 15px;
              font-size: 0.875rem;
            }
          }
        }
      }
    }
  }

  .back-button {
    display: inline-block;
    padding: 0.5rem 1rem;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cars/single-car/${id}`);
        if (response.data.status === 'success' && response.data.data.length > 0) {
          setCar(response.data.data[0]);
        } else {
          throw new Error('Car not found');
        }
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="loading">Loading car details...</div>
      </Container>
    );
  }

  if (error || !car) {
    return (
      <Container>
        <div className="error">
          <h2>Error Loading Car Details</h2>
          <p>{error}</p>
          <Link to="/users-car" className="back-button">Back to Cars</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="car-details">
        <div className="header">
          <Link to="/users-car" className="back-button">← Back to Cars</Link>
          <h1>{car.title}</h1>
          <p className="dealer-info">
            Listed by {car.dealer.name} • {car.dealer.email}
          </p>
        </div>

        <div className="main-content">
          <div className="image-section">
            <img src={car.image} alt={car.title} />
          </div>

          <div className="info-section">
            <div className="price-tag">₹{(car.price).toLocaleString('en-IN')}</div>
            
            <div className="description">
              <h3>Description</h3>
              <p>{car.description}</p>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <FaCar />
                <h4>Brand & Model</h4>
                <p>{car.oemSpecs.brand} {car.oemSpecs.model}</p>
              </div>

              <div className="spec-item">
                <FaTachometerAlt />
                <h4>Mileage</h4>
                <p>{car.oemSpecs.mileage} kmpl</p>
              </div>

              <div className="spec-item">
                <FaPaintBrush />
                <h4>Colors Available</h4>
                <div className="colors-list">
                  {car.oemSpecs.colors.map((color, index) => (
                    <span key={index} className="color-tag">{color}</span>
                  ))}
                </div>
              </div>

              <div className="spec-item">
                <FaHistory />
                <h4>Vehicle History</h4>
                <ul>
                  <li>Odometer: {car.kmOnOdometer} km</li>
                  <li>Original Paint: {car.originalPaint}</li>
                  <li>Major Scratches: {car.majorScratches}</li>
                  <li>Accidents Reported: {car.accidentsReported}</li>
                  <li>Previous Buyers: {car.previousBuyers}</li>
                </ul>
              </div>

              <div className="spec-item">
                <FaMapMarkerAlt />
                <h4>Registration</h4>
                <p>{car.registrationPlace}</p>
              </div>

              <div className="spec-item">
                <FaUser />
                <h4>Contact Dealer</h4>
                <p>{car.dealer.name}</p>
                <p>{car.dealer.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CarDetails;
