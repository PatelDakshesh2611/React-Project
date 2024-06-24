import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import { Outlet } from 'react-router-dom';

const AuthProtection: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);

  if (token) {
    return <Navigate to="/products" />;
  }

  return (
    <div><Outlet/></div>
  );
};

export default AuthProtection;
