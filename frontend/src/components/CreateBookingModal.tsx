import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Building2 } from 'lucide-react';
import api from '../services/api';
import { Button } from './Button';
import { toast } from 'react-toastify';
import type { Hotel } from '../types';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    hotel_id: '',
    responsible_name: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/hotels')
         .then(res => setHotels(res.data))
         .catch(() => toast.error('Erro ao carregar lista de hotéis'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/bookings', formData);
      
      toast.success('Reserva criada com sucesso!');
      
      setFormData({ hotel_id: '', responsible_name: '', start_date: '', end_date: '' });
      
      onSuccess(); 
      onClose();  
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao criar reserva.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Nova Reserva</h2>
              <p className="text-sm text-gray-500">Preencha os dados da estadia</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="create-booking-form" onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select 
                  required
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary bg-white appearance-none"
                  value={formData.hotel_id}
                  onChange={e => setFormData({...formData, hotel_id: e.target.value})}
                >
                  <option value="">Selecione um hotel...</option>
                  {hotels.map(h => (
                    <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
                  ))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável *</label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="text"
                  placeholder="Nome do hóspede principal"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={formData.responsible_name}
                  onChange={e => setFormData({...formData, responsible_name: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in *</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out *</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2 text-gray-600 hover:bg-white hover:text-red-500 border border-transparent hover:border-red-200 rounded-lg text-sm font-bold uppercase transition-all"
          >
            Cancelar
          </button>
          <Button type="submit" form="create-booking-form" disabled={loading}>
            {loading ? 'Criando...' : 'Confirmar Reserva'}
            {!loading && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>

      </div>
    </div>
  );
};