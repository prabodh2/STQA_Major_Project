import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../utils/axiosConfig';
import { DEALER_AUTH, LOGIN_FAILURE, LOGIN_REQUEST } from '../redux/AuthReducer/actionType';
import { FaUser, FaLock } from 'react-icons/fa';

const DealerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await api.post('/user/dealer-login', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'dealer');
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userId', response.data.user._id);
        
        dispatch({ 
          type: DEALER_AUTH, 
          payload: response.data.token,
          name: response.data.user.name
        });
        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 3000
        });
        navigate('/dealers');
      }
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE });
      toast.error(error.response?.data?.message || 'Login failed', {
        position: 'top-center',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DIV>
      <div className="login-container">
        <h2>Dealer Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </DIV>
  );
};

export default DealerLogin;

const DIV = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .login-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .input-group {
      position: relative;
      margin-bottom: 1rem;

      .icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #718096;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        padding-left: 2.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #4299e1;
        }
      }
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: #4299e1;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;

      &:hover {
        background: #3182ce;
      }

      &:disabled {
        background: #a0aec0;
        cursor: not-allowed;
      }
    }
  }
`;
