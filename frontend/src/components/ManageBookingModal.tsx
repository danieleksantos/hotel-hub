import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Trash2, Users, Plus, CreditCard } from 'lucide-react';
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
        popup: 'rounded-xl shadow-2xl border-none',
        confirmButton: 'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer mx-2 bg-red-500 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
        cancelButton: 'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer mx-2 bg-green-600 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400'
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
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Gerenciar Reserva</h2>
             <p className="text-sm text-gray-500">{booking.hotel_name} • {booking.city}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
               <h3 className="font-bold text-gray-700 border-b pb-2 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Dados da Estadia</h3>
               <form onSubmit={handleUpdateBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={editData.responsible_name} onChange={e => setEditData({...editData, responsible_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={editData.start_date} onChange={e => setEditData({...editData, start_date: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out</label><input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={editData.end_date} onChange={e => setEditData({...editData, end_date: e.target.value})} /></div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full cursor-pointer">{loading ? 'Salvando...' : 'Atualizar Dados'}</Button>
               </form>

               <div className="pt-8 mt-8 border-t border-gray-100">
                  <h3 className="font-bold text-red-600 border-b border-red-100 pb-2 mb-4 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Zona de Perigo</h3>
                  <button onClick={handleDeleteBooking} className="w-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">Cancelar Reserva permanentemente</button>
               </div>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Hóspedes Acompanhantes</h3>
                <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto pr-1">
                    {guests.length === 0 && <p className="text-sm text-gray-400 text-center py-4 italic">Nenhum hóspede adicional.</p>}
                    {guests.map(guest => (
                        <div key={guest.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                            <div><p className="font-bold text-sm text-gray-800">{guest.name}</p><p className="text-xs text-gray-500">{guest.document}</p></div>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddGuest} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-primary uppercase mb-3 flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar Hóspede</h4>
                    <div className="space-y-3">
                        <input required type="text" placeholder="Nome" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-primary transition-colors" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} />
                        <div className="flex gap-2">
                            <input required type="text" placeholder="Documento" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-primary transition-colors" value={newGuest.document} onChange={e => setNewGuest({...newGuest, document: e.target.value})} />
                            <button type="submit" disabled={loadingGuest} className="bg-secondary hover:bg-secondary/90 text-white px-3 py-2 rounded-md font-bold transition-colors disabled:opacity-50 cursor-pointer"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </form>
            </section>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 text-xs font-bold uppercase tracking-wider hover:text-red-500 transition-all cursor-pointer">Fechar</button>
        </div>
      </div>
    </div>
  );
};