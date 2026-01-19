import React, { useState, useEffect } from 'react'
import { X, Save, Calendar, User, Building2 } from 'lucide-react'
import api from '../services/api'
import { Button } from './Button'
import { toast } from 'react-toastify'
import type { Hotel } from '../types'

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    hotel_id: '',
    responsible_name: '',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    if (isOpen) {
      api
        .get<Hotel[]>('/hotels')
        .then((res) => setHotels(res.data))
        .catch((error) => {
          console.error(error)
          toast.error('Erro ao carregar lista de hotéis.')
        })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast.error('A data de check-out deve ser posterior ao check-in.')
      return
    }

    setLoading(true)

    try {
      await api.post('/bookings', formData)
      toast.success('Reserva criada com sucesso!')
      setFormData({
        hotel_id: '',
        responsible_name: '',
        start_date: '',
        end_date: '',
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao criar reserva. Verifique a disponibilidade.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto animate-in zoom-in duration-200 border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                Nova Reserva
              </h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Formulário de Entrada
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all cursor-pointer outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <form
            id="create-booking-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">
                Unidade / Hotel *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none transition-all font-medium text-gray-700 cursor-pointer"
                  value={formData.hotel_id}
                  onChange={(e) =>
                    setFormData({ ...formData, hotel_id: e.target.value })
                  }
                >
                  <option value="">Selecione um hotel...</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} - {h.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">
                Hóspede Responsável *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Nome completo"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-700"
                  value={formData.responsible_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsible_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">
                  Check-in *
                </label>
                <input
                  required
                  type="date"
                  min={today}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-600 text-sm"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-sans">
                  Check-out *
                </label>
                <input
                  required
                  type="date"
                  min={formData.start_date || today}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-600 text-sm"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          </form>

          <div className="mt-0 md:mt-5 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-end gap-3">
            <Button
              type="submit"
              form="create-booking-form"
              disabled={loading}
              className="w-full md:min-w-[200px] shadow-xl active:scale-95 transition-all order-1 md:order-2"
            >
              {loading ? 'Finalizando...' : 'Confirmar Reserva'}
              {!loading && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
