import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getRandomCarImage } from '../constants/carImages';

const BASE_URL = "http://localhost:4000";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.2em;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #fff5f5;
  border-radius: 4px;
`;

const NoCars = styled.div`
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;

  p {
    margin-bottom: 20px;
    color: #666;
    font-size: 1.1em;
  }

  button {
    padding: 12px 24px;
    background-color: #2c5282;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #2a4365;
    }
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const CarCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CarInfo = styled.div`
  padding: 15px;

  h3 {
    margin: 0 0 10px;
    color: #2d3748;
  }

  p {
    margin: 5px 0;
    color: #4a5568;

    &.price {
      font-size: 1.2em;
      color: #2c5282;
      font-weight: bold;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 8px 16px;
  margin-top: 10px;
  background-color: #2c5282;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a4365;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #e53e3e;

  &:hover {
    background-color: #c53030;
  }
`;

const DealerCars = () => {
  console.log('DealerCars component rendered');
  
  const navigate = useNavigate();
  const [dealerCars, setDealerCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackImages] = useState(new Map());

  // Fetch dealer's cars
  useEffect(() => {
    const fetchDealerCars = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (!token || userRole !== 'dealer') {
        toast.error('Please login as a dealer');
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BASE_URL}/inventory/my-cars`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Dealer cars response:', response.data);
        setDealerCars(response.data);
      } catch (err) {
        console.error('Error fetching dealer cars:', err);
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(`Failed to load cars: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealerCars();
  }, [navigate]);

  const handleEdit = (carId) => {
    navigate(`/edit-car/${carId}`);
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/inventory/delete-car/${carId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove the car from local state
      setDealerCars(prevCars => prevCars.filter(car => car._id !== carId));
      toast.success('Car deleted successfully');
    } catch (err) {
      console.error('Error deleting car:', err);
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to delete car: ${errorMessage}`);
    }
  };

  const getFallbackImage = (carId) => {
    if (!fallbackImages.has(carId)) {
      fallbackImages.set(carId, getRandomCarImage());
    }
    return fallbackImages.get(carId);
  };

  if (isLoading) {
    return (
      <Container>
        <h1>My Cars</h1>
        <LoadingSpinner>Loading your cars...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h1>Error Loading Cars</h1>
        <ErrorMessage>{error}</ErrorMessage>
        <NoCars>
          <button onClick={() => window.location.reload()}>Retry</button>
        </NoCars>
      </Container>
    );
  }

  return (
    <Container>
      <h1>My Cars</h1>
      {dealerCars.length === 0 ? (
        <NoCars>
          <p>You haven't added any cars yet.</p>
          <button onClick={() => navigate('/add-car')}>Add Your First Car</button>
        </NoCars>
      ) : (
        <CarsGrid>
          {dealerCars.map((car) => (
            <CarCard key={car._id}>
              <CarImage 
                src={car.image || getFallbackImage(car._id)} 
                alt={car.title}
                onError={(e) => e.target.src = getFallbackImage(car._id)}
              />
              <CarInfo>
                <h3>{car.title}</h3>
                <p>{car.description}</p>
                <p className="price">₹{car.price.toLocaleString('en-IN')}</p>
                <p>Kilometers: {car.kmOnOdometer.toLocaleString('en-IN')}</p>
                <p>Registration: {car.registrationPlace}</p>
                <ButtonGroup>
                  <Button onClick={() => handleEdit(car._id)}>Edit Car</Button>
                  <DeleteButton onClick={() => handleDelete(car._id)}>Delete Car</DeleteButton>
                </ButtonGroup>
              </CarInfo>
            </CarCard>
          ))}
        </CarsGrid>
      )}
    </Container>
  );
};

export default DealerCars;
