import React, { useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import api from '../services/api';
import { Button } from './Button';
import { toast } from 'react-toastify';
import type { Hotel } from '../types';


interface CreateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newHotel: Hotel) => void; 
}

export const CreateHotelModal: React.FC<CreateHotelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    stars: 3,
    total_rooms: 10,
    description: '',
    photo_url: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<Hotel>('/hotels', formData); 
      
      toast.success('Hotel cadastrado com sucesso!');
      
      onSuccess(response.data);
      
      onClose();
      
      setFormData({
        name: '', city: '', address: '', stars: 3, total_rooms: 10, description: '', photo_url: ''
      });
      
    } catch (error) {
      console.error(error);
      toast.error('Erro ao cadastrar hotel. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Novo Hotel</h2>
              <p className="text-sm text-gray-500">Preencha os dados da nova filial</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="create-hotel-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Hotel *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Ex: Hotel Hub Palace"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Ex: São Paulo"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Rua, Número, Bairro"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classificação (Estrelas) *</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                value={formData.stars}
                onChange={e => setFormData({...formData, stars: Number(e.target.value)})}
              >
                <option value="1">1 Estrela</option>
                <option value="2">2 Estrelas</option>
                <option value="3">3 Estrelas</option>
                <option value="4">4 Estrelas</option>
                <option value="5">5 Estrelas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total de Quartos *</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.total_rooms}
                onChange={e => setFormData({...formData, total_rooms: Number(e.target.value)})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto (Opcional)</label>
              <input 
                type="url" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="https://..."
                value={formData.photo_url}
                onChange={e => setFormData({...formData, photo_url: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                placeholder="Detalhes sobre o hotel..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-center gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 
                       bg-white text-gray-600 text-sm font-bold uppercase tracking-wider shadow-sm
                       hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all duration-200 
                       cursor-pointer whitespace-nowrap min-w-[140px]"
          >
            Cancelar
          </button>
          
          <Button 
            type="submit" 
            form="create-hotel-form" 
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? 'Salvando...' : 'Salvar Hotel'}
            {!loading && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>

      </div>
    </div>
  );
};