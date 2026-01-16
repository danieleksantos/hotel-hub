import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Hotels } from './pages/Hotels';     

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { signed } = useAuth();
  return signed ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            } 
          >
            <Route index element={<Hotels />} />      
            <Route path="bookings" element={<div className="text-2xl">Tela de Reservas (Em breve)</div>} />
          </Route>
        </Routes>
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;