import React, { useState, useEffect } from 'react'
import { X, Save, Building2, Trash2 } from 'lucide-react'
import api from '../services/api'
import { Button } from './Button'
import { toast } from 'react-toastify'
import { alertService } from '../services/sweetAlert'
import type { Hotel, HotelFormData } from '../types'

interface ManageHotelModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  hotel: Hotel | null
}

export const ManageHotelModal: React.FC<ManageHotelModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  hotel,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    city: '',
    address: '',
    stars: 3,
    total_rooms: 10,
    description: '',
    photo_url: '',
  })

  useEffect(() => {
    if (isOpen && hotel) {
      setFormData({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        stars: hotel.stars || 3,
        total_rooms: hotel.total_rooms || 10,
        description: hotel.description || '',
        photo_url: hotel.photo_url || '',
      })
    }
  }, [isOpen, hotel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/hotels/${hotel?.id}`, formData)
      toast.success('Hotel atualizado com sucesso!')
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Update Error:', error)
      toast.error('Erro ao atualizar hotel.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!hotel) return

    const result = await alertService.destructive(
      'Remover Hotel?',
      `Esta ação é irreversível. Ao excluir o <b>${hotel.name}</b>, todas as reservas e hóspedes vinculados serão apagados permanentemente.`,
    )

    if (result.isConfirmed) {
      try {
        await api.delete(`/hotels/${hotel.id}`)
        toast.success('Hotel removido com sucesso!')
        onUpdate()
        onClose()
      } catch (error) {
        console.error('Delete Error:', error)
        toast.error('Erro ao excluir hotel.')
      }
    }
  }

  if (!isOpen || !hotel) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                Gerenciar Unidade
              </h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Edição de Informações
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all cursor-pointer outline-none active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <form
            id="manage-hotel-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Nome do Hotel *
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-700 transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Cidade *
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium text-gray-600"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Classificação *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer font-medium text-gray-600"
                value={formData.stars}
                onChange={(e) =>
                  setFormData({ ...formData, stars: Number(e.target.value) })
                }
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {s} Estrelas
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Endereço Completo *
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium text-gray-600"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Total de Quartos *
              </label>
              <input
                required
                type="number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium text-gray-600"
                value={formData.total_rooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_rooms: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                URL da Foto
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-medium text-gray-600"
                value={formData.photo_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 pb-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Descrição
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none font-medium text-gray-600"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                         text-red-500 bg-red-50 border border-red-100 text-[12px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer 
                         outline-none order-2 md:order-1 active:scale-95"
            >
              <Trash2 className="w-4 h-4" /> Excluir Unidade
            </button>

            <div className="w-full md:w-auto order-1 md:order-2">
              <Button
                type="submit"
                form="manage-hotel-form"
                disabled={loading}
                className="w-full md:min-w-[220px] shadow-lg"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
                {!loading && <Save className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
