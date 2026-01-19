import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Button } from '../components/Button'
import { CreateHotelModal } from '../components/CreateHotelModal'
import { ManageHotelModal } from '../components/ManageHotelModal'
import { Plus, MapPin, Star, BedDouble, Settings2 } from 'lucide-react'
import { toast } from 'react-toastify'
import type { Hotel } from '../types'

const DEFAULT_IMAGE =
  'https://placehold.co/600x400/0f5132/FFF?text=Hotel+Hub&font=montserrat'

export const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  async function loadHotels() {
    setLoading(true)
    try {
      const response = await api.get<Hotel[]>('/hotels')
      setHotels(response.data)
    } catch (error) {
      console.error('Error loading hotels:', error)
      toast.error('Erro ao carregar hotéis.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
  }, [])

  const handleManageClick = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsManageModalOpen(true)
  }

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = DEFAULT_IMAGE
  }

  return (
    <div>
      <CreateHotelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadHotels}
      />

      <ManageHotelModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false)
          setSelectedHotel(null)
        }}
        onUpdate={loadHotels}
        hotel={selectedHotel}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nossos Hotéis</h1>
          <p className="text-gray-500 mt-1">
            Gerencie a rede de hotéis cadastrada
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Novo Hotel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group flex flex-col h-full"
            >
              <div className="h-56 bg-gray-200 relative overflow-hidden">
                <img
                  src={hotel.photo_url || DEFAULT_IMAGE}
                  alt={hotel.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10">
                  <span className="font-bold text-primary text-xs uppercase">
                    {hotel.total_rooms} Quartos
                  </span>
                  <BedDouble className="w-3 h-3 text-secondary" />
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                  {hotel.name}
                </h3>
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= (hotel.stars || 0) ? 'text-secondary fill-secondary' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center text-gray-500 mb-2 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
                  <span className="truncate">
                    {hotel.address ? `${hotel.address}, ` : ''}
                    {hotel.city}
                  </span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1 italic">
                  "{hotel.description || 'Sem descrição disponível.'}"
                </p>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Button onClick={() => handleManageClick(hotel)} className="">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Gerenciar Unidade
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
