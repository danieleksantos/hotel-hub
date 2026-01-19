import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Building2 } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../services/api';
import { Button } from './Button';
import { toast } from 'react-toastify';
import type { Hotel, ApiError } from '../types';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    hotel_id: '',
    responsible_name: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get<Hotel[]>('/hotels')
         .then(res => setHotels(res.data))
         .catch((err: unknown) => {
           console.error('Fetch Hotels Error:', err);
           toast.error('Erro ao carregar lista de hotéis');
         });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast.error('A data de check-out deve ser posterior ao check-in.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/bookings', formData);
      
      toast.success('Reserva criada com sucesso!');
      setFormData({ hotel_id: '', responsible_name: '', start_date: '', end_date: '' });
      
      onSuccess(); 
      onClose();  
      
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error('Create Booking Error Details:', error);
      
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
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">Nova Reserva</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Início do check-in de hóspedes</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="create-booking-form" onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Unidade / Hotel *</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select 
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none transition-all font-medium text-gray-700 cursor-pointer"
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
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Hóspede Responsável *</label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="text"
                  placeholder="Nome completo para reserva"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-700"
                  value={formData.responsible_name}
                  onChange={e => setFormData({...formData, responsible_name: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Data de Check-in *</label>
              <input 
                required
                type="date"
                min={today}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-600 cursor-text"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Data de Check-out *</label>
              <input 
                required
                type="date"
                min={formData.start_date || today}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-600 cursor-text"
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
         
          <Button 
            type="submit" 
            form="create-booking-form" 
            disabled={loading}
            className="shadow-lg hover:shadow-primary/20 active:scale-95 transition-all min-w-[180px]"
          >
            {loading ? 'Finalizando...' : 'Confirmar Reserva'}
            {!loading && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};