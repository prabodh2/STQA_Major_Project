import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { isdealerauth } = useSelector((store) => {
    console.log('Auth State:', store.AuthReducer);
    return store.AuthReducer;
  });

  console.log('Is Dealer Auth:', isdealerauth);
  
  // Check local storage as fallback
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = isdealerauth || (token && userRole === 'dealer');

  console.log('Authentication check:', { isdealerauth, token, userRole, isAuthenticated });

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;