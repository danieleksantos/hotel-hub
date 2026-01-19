import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '../services/api';
import { Button } from '../components/Button';
import { SearchBar, type SearchType } from '../components/SearchBar';
import { CreateBookingModal } from '../components/CreateBookingModal';
import { ManageBookingModal } from '../components/ManageBookingModal';
import { Plus, Users, Settings2, MapPin, CreditCard, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Booking, ApiError } from '../types';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await api.get<Booking[]>('/bookings');
      setBookings(response.data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error('Erro ao carregar reservas:', error);
      const msg = error.response?.data?.error || 'Erro ao carregar reservas.';
      toast.error(msg);
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
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const getDays = (start: string, end: string) => {
    const d1 = new Date(start.split('T')[0] + 'T00:00:00');
    const d2 = new Date(end.split('T')[0] + 'T00:00:00');
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const matchHotel = b.hotel_name.toLowerCase().includes(term);
    const matchGuest = b.responsible_name.toLowerCase().includes(term);
    if (searchType === 'hotel') return matchHotel;
    if (searchType === 'guest') return matchGuest;
    return matchHotel || matchGuest;
  });

  return (
    <div className="p-4 md:p-0">
      <CreateBookingModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadBookings}
      />

      <ManageBookingModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onUpdate={loadBookings}
        booking={selectedBooking}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reservas</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Listagem e gerenciamento de estadias</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full md:w-auto cursor-pointer">
          <Plus className="w-5 h-5" />
          Nova Reserva
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm}
          searchType={searchType}
          onTypeChange={setSearchType}
          placeholder={`Buscar ${searchType === 'all' ? 'reserva' : searchType === 'hotel' ? 'por hotel' : 'por responsável'}...`}
          count={filteredBookings.length}
        />
        
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando Banco...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
            <div>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Hotel / Cidade</th>
                                <th className="px-6 py-4">Responsável</th>
                                <th className="px-6 py-4">Período</th>
                                <th className="px-6 py-4 text-center">Pessoas</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                                                {booking.hotel_photo ? (
                                                    <img src={booking.hotel_photo} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <CreditCard className="w-5 h-5 text-gray-200" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{booking.hotel_name}</p>
                                                <div className="flex items-center text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                                                  <MapPin className="w-3 h-3 mr-1" /> {booking.city}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-bold uppercase text-xs tracking-tight">
                                      {booking.responsible_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold text-xs">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                                            <span className="text-[10px] font-black uppercase text-primary/60">{getDays(booking.start_date, booking.end_date)} noites</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 border border-blue-100">
                                            <Users className="w-3 h-3" />
                                            {1 + (booking.guest_count || 0)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button onClick={() => handleManage(booking)} className="cursor-pointer scale-90 origin-right active:scale-75">
                                            <Settings2 className="w-4 h-4" />
                                            Gerenciar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="p-4 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                                        {booking.hotel_photo ? <img src={booking.hotel_photo} className="w-full h-full object-cover" alt="" /> : <CreditCard className="w-6 h-6 text-gray-200" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 leading-tight">{booking.hotel_name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{booking.city}</p>
                                    </div>
                                </div>
                                {/* AJUSTADO: Agora exibe ícone e número igual ao desktop */}
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 border border-blue-100">
                                    <Users className="w-3 h-3" />
                                    {1 + (booking.guest_count || 0)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <div className="col-span-2 border-b border-gray-200 pb-2 mb-1">
                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Responsável</p>
                                    <p className="text-sm font-bold text-gray-800 uppercase">{booking.responsible_name}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Entrada</p>
                                    <p className="text-xs font-bold text-gray-700">{formatDate(booking.start_date)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Saída</p>
                                    <p className="text-xs font-bold text-gray-700">{formatDate(booking.end_date)}</p>
                                </div>
                            </div>

                            <Button onClick={() => handleManage(booking)} className="w-full cursor-pointer shadow-md active:scale-95 transition-transform">
                                <Settings2 className="w-4 h-4" />
                                Gerenciar Reserva
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nenhum registro encontrado</p>
            <button 
              onClick={() => { setSearchTerm(''); setSearchType('all'); }} 
              className="mt-4 text-primary text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};