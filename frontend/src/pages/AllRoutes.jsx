import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import DealerLogin from './DealerLogin';
import DealersPage from './DealersPage';
import UsersPage from './UsersPage';
import DealerCars from './DealerCars';
import CarDetails from './CarDetails';
import PrivateRoutes from '../components/PrivateRoutes';
import AddCar from './AddCar';
import EditCar from './EditCar';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dealer-login' element={<DealerLogin/>} />
      <Route path='/dealers' element={<DealersPage/>} />
      <Route path='/users-car' element={<UsersPage/>} />
      <Route path='/car/:id' element={<CarDetails/>} />
      <Route element={<PrivateRoutes/>}>
        <Route path='/add-car' element={<AddCar/>} />
        <Route path='/dealer-cars' element={<DealerCars/>} />
        <Route path='/edit-car/:id' element={<EditCar/>} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;