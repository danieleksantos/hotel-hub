import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { CreateBookingModal } from '../components/CreateBookingModal';
import { ManageBookingModal } from '../components/ManageBookingModal'; // <--- Import Novo
import { Plus, Search, Users, Settings2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Booking } from '../types';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controle dos Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  async function loadBookings() {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar reservas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handleManage = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsManageModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const getDays = (start: string, end: string) => {
    const d1 = new Date(start).getTime();
    const d2 = new Date(end).getTime();
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div>
      {/* Modal de Criação (Simples) */}
      <CreateBookingModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadBookings}
      />

      {/* Modal de Gerenciamento (Dashboard) */}
      <ManageBookingModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onUpdate={loadBookings}
        booking={selectedBooking}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reservas</h1>
          <p className="text-gray-500 mt-1">Gerencie check-ins, check-outs e ocupação</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Nova Reserva
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Busca */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                />
            </div>
        </div>
        
        {!loading && bookings.length > 0 && (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Hotel</th>
                            <th className="px-6 py-4">Responsável</th>
                            <th className="px-6 py-4">Período</th>
                            <th className="px-6 py-4 text-center">Ocupação</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => {
                            const totalGuests = 1 + (booking.guest_count || 0);

                            return (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0 shadow-sm">
                                                {booking.hotel_photo ? (
                                                    <img src={booking.hotel_photo} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">H</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{booking.hotel_name}</p>
                                                <p className="text-xs text-gray-500">{booking.city}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{booking.responsible_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                                            <span className="text-xs text-gray-500">{getDays(booking.start_date, booking.end_date)} diárias</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-100">
                                                <Users className="w-3 h-3" />
                                                {totalGuests}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button 
                                            onClick={() => handleManage(booking)}
                                        >
                                            <Settings2 className="w-4 h-4" />
                                            Gerenciar
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};