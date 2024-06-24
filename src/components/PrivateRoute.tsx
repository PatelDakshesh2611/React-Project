// src/components/PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import {  Outlet } from 'react-router-dom';
import { RootState } from '../store';
import { selectCartItems } from '../reducers/cartSlice';

const PrivateRoute: React.FC = () => {
  const items = useSelector(selectCartItems);
  const token = useSelector((state: RootState) => state.user.token);
  
  return token && items.length>0? <Outlet /> : <h2>Unauthorized</h2>;
};

export default PrivateRoute;
