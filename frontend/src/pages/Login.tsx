import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ username, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="bg-primary p-8 text-center relative">
          

          <div className="absolute top-4 right-4 flex gap-1 p-1.5 rounded-full px-3 backdrop-blur-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="w-4 h-4 text-secondary" 
                fill="currentColor" 
              />
            ))}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide mt-2">
            HOTEL HUB
          </h1>
          <p className="text-primary-light text-sm font-light uppercase tracking-widest opacity-90">
            Premium Management
          </p>
        </div>

        <div className="p-8 pt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Usuário
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             text-gray-700 placeholder-gray-400 outline-none transition-all"
                  placeholder="Seu usuário de acesso"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             text-gray-700 placeholder-gray-400 outline-none transition-all"
                  placeholder="Sua senha secreta"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg 
                         text-sm font-bold text-white uppercase tracking-wider
                         bg-gradient-to-r from-primary to-primary-hover 
                         hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <LogIn className="w-5 h-5 mr-2 text-secondary-light" />
              Acessar Sistema
            </button>

          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Hotel Hub &copy; 2026
          </p>
          <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <p className="text-xs text-gray-500">System Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};