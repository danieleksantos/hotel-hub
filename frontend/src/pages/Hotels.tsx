import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/Button';
import { CreateHotelModal } from '../components/CreateHotelModal';
import { Plus, MapPin, Star, Trash2, Edit, Building2, BedDouble } from 'lucide-react';
import { toast } from 'react-toastify';

interface Hotel {
  id: string;
  name: string;
  city: string;
  total_rooms: number;
  photo_url?: string | null;
  state?: string;
  stars?: number;
  address?: string; 
  description?: string; 
}

const DEFAULT_IMAGE = "https://placehold.co/600x400/0f5132/FFF?text=Hotel+Hub&font=montserrat";

export const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  async function loadHotels() {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Erro ao buscar hotéis:', error);
      toast.error('Erro ao carregar hotéis.');
    } finally {
      setLoading(false);
    }
  }

  const handleHotelCreated = (newHotel: Hotel) => {
    setHotels([newHotel, ...hotels]);
  };

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este hotel?')) return;
    try {
      await api.delete(`/hotels/${id}`);
      toast.success('Hotel removido com sucesso!');
      setHotels(hotels.filter(hotel => hotel.id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao deletar hotel.');
    }
  }

  useEffect(() => {
    loadHotels();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div>
      <CreateHotelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleHotelCreated}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nossos Hotéis</h1>
          <p className="text-gray-500 mt-1">Gerencie a rede de hotéis cadastrada</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Novo Hotel
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && hotels.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">Nenhum hotel encontrado</h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            Comece adicionando sua primeira filial.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Agora
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group flex flex-col h-full">
            
            <div className="h-56 bg-gray-200 relative overflow-hidden group">
              <img 
                src={hotel.photo_url || DEFAULT_IMAGE} 
                alt={hotel.name}
                onError={handleImageError} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10">
                <span className="font-bold text-primary text-xs uppercase">
                  {hotel.total_rooms} Quartos
                </span>
                <BedDouble className="w-3 h-3 text-secondary" />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{hotel.name}</h3>
              
              <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= (hotel.stars || 0) ? 'text-secondary fill-secondary' : 'text-gray-300'}`} 
                      />
                  ))}
              </div>

              <div className="flex items-center text-gray-500 mb-2 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
                <span className="truncate">{hotel.address ? `${hotel.address}, ` : ''}{hotel.city}</span>
              </div>
              
              <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">
                {hotel.description || 'Sem descrição disponível.'}
              </p>

              <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors text-sm font-medium border border-gray-200 cursor-pointer">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(hotel.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};