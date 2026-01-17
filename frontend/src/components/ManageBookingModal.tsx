import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Trash2, Users, Plus, CreditCard, Save } from 'lucide-react';
import api from '../services/api';
import { Button } from './Button';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { Booking, Guest } from '../types';

const MySwal = withReactContent(Swal);

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; 
  booking: Booking | null;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  booking 
}) => {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editData, setEditData] = useState({ responsible_name: '', start_date: '', end_date: '' });
  const [newGuest, setNewGuest] = useState({ name: '', document: '' });
  const [loadingGuest, setLoadingGuest] = useState(false);

  const loadGuests = useCallback(async () => {
    if (!booking) return;
    try {
      const response = await api.get<Guest[]>(`/bookings/${booking.id}/guests`);
      setGuests(response.data);
    } catch (error) {
      console.error("Erro ao buscar hóspedes:", error);
    }
  }, [booking]);

  useEffect(() => {
    if (isOpen && booking) {
      setEditData({
        responsible_name: booking.responsible_name,
        start_date: booking.start_date.split('T')[0],
        end_date: booking.end_date.split('T')[0]
      });
      loadGuests();
    }
  }, [isOpen, booking, loadGuests]);

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setLoading(true);
    try {
      await api.put(`/bookings/${booking.id}`, { hotel_id: booking.hotel_id, ...editData });
      toast.success('Reserva atualizada!');
      onUpdate();
      onClose(); // Fecha após salvar para fluidez
    } catch (error) {
      console.error("Update Error", error);
      toast.error('Erro ao atualizar.');
    } finally { setLoading(false); }
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;

    const result = await MySwal.fire({
      title: <p className="text-2xl font-bold text-gray-800">Cancelar Reserva?</p>,
      html: <div className="text-gray-600">Esta ação cancelará a reserva de <b>{booking.responsible_name}</b> e liberará o quarto.</div>,
      icon: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: 'Sim, cancelar reserva',
      cancelButtonText: 'Manter reserva',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl border-none p-4', 
        actions: 'flex flex-col md:flex-row gap-3 mt-4 w-full justify-center',
        confirmButton: 'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer w-full md:w-auto bg-red-500 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
        cancelButton: 'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer w-full md:w-auto bg-green-600 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookings/${booking.id}`);
        toast.success('Reserva cancelada.');
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Delete Error", error);
        toast.error('Erro ao cancelar.');
      }
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setLoadingGuest(true);
    try {
      await api.post('/guests', { booking_id: booking.id, ...newGuest });
      toast.success('Hóspede adicionado!');
      setNewGuest({ name: '', document: '' });
      loadGuests();
      onUpdate();
    } catch (error) {
      console.error("Guest Error", error);
      toast.error('Erro ao adicionar.');
    } finally { setLoadingGuest(false); }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">Gerenciar Reserva</h2>
              <p className="text-sm text-gray-500">{booking.hotel_name} • {booking.city}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer border border-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* FORMULÁRIO (ESQUERDA) */}
            <div className="space-y-6">
               <h3 className="font-bold text-gray-700 border-b pb-3 flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-primary" />
                 Dados da Estadia
               </h3>
               
               <form id="edit-booking-form" onSubmit={handleUpdateBooking} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Responsável pela Reserva</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editData.responsible_name} onChange={e => setEditData({...editData, responsible_name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Check-in</label>
                      <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editData.start_date} onChange={e => setEditData({...editData, start_date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Check-out</label>
                      <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editData.end_date} onChange={e => setEditData({...editData, end_date: e.target.value})} />
                    </div>
                  </div>
               </form>
            </div>

            {/* HÓSPEDES (DIREITA) */}
            <div className="flex flex-col bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-3 mb-6 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Hóspedes
                    </span>
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{guests.length}</span>
                </h3>

                <div className="space-y-3 mb-6 flex-1 overflow-y-auto min-h-[120px] max-h-[220px] pr-2 custom-scrollbar">
                    {guests.length === 0 ? (
                        <p className="text-sm italic text-gray-400 text-center py-4">Nenhum acompanhante.</p>
                    ) : (
                      guests.map(guest => (
                          <div key={guest.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                              <div>
                                  <p className="font-bold text-sm text-gray-800">{guest.name}</p>
                                  <p className="text-[10px] text-gray-500 font-mono">{guest.document}</p>
                              </div>
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          </div>
                      ))
                    )}
                </div>

                <form onSubmit={handleAddGuest} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="space-y-3">
                        <input required type="text" placeholder="Nome do acompanhante" className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg outline-none focus:border-primary bg-gray-50 focus:bg-white transition-all" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} />
                        <div className="flex gap-2">
                            <input required type="text" placeholder="Documento" className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg outline-none focus:border-primary bg-gray-50 focus:bg-white transition-all" value={newGuest.document} onChange={e => setNewGuest({...newGuest, document: e.target.value})} />
                            <button type="submit" disabled={loadingGuest} className="bg-secondary text-primary hover:bg-primary hover:text-white px-3 rounded-lg font-bold transition-all cursor-pointer">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
          </div>
        </div>

        {/* FOOTER FIXO - Ações principais aqui */}
        <div className="p-6 border-t border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          <button 
            type="button" 
            onClick={handleDeleteBooking} 
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer order-2 md:order-1"
          >
            <Trash2 className="w-4 h-4" />
            Cancelar Reserva
          </button>

          <div className="flex items-center gap-4 w-full md:w-auto order-1 md:order-2">
            <Button 
              type="submit" 
              form="edit-booking-form" 
              disabled={loading}
              className="w-full md:min-w-[180px] cursor-pointer"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
              {!loading && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};