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

  .car-details {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .image-section {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-section {
      padding: 2rem;

      h1 {
        font-size: 2rem;
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .price {
        font-size: 1.5rem;
        color: #2c5282;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .description {
        color: #4a5568;
        line-height: 1.6;
        margin-bottom: 2rem;
      }

      .specs {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;

        .spec-item {
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;

          .label {
            display: block;
            color: #4a5568;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .value {
            color: #2d3748;
            font-weight: 500;
          }
        }
      }
    }
  }

  .loading, .error, .not-found {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
      color: #2c5282;
      margin-bottom: 1rem;
    }

    p {
      color: #4a5568;
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
