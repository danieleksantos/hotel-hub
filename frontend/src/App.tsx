import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Login } from './pages/Login';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { signed } = useAuth();

  if (!signed) {
    return <Navigate to="/" />;
  }

  return <>{children}</>; 
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
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                   <h1 className="text-3xl text-primary font-bold">🎉 Login realizado com sucesso!</h1>
                   <p className="mt-4 text-gray-600">Bem-vindo ao Dashboard.</p>
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;