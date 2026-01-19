import React, { useState, useEffect, useCallback } from 'react'
import {
  X,
  Calendar,
  Trash2,
  Users,
  Plus,
  CreditCard,
  Save,
} from 'lucide-react'
import api from '../services/api'
import { Button } from './Button'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import type { Booking, Guest } from '../types'

const MySwal = withReactContent(Swal)

interface ManageBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  booking: Booking | null
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  booking,
}) => {
  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [editData, setEditData] = useState({
    responsible_name: '',
    start_date: '',
    end_date: '',
  })
  const [newGuest, setNewGuest] = useState({ name: '', document: '' })
  const [loadingGuest, setLoadingGuest] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const loadGuests = useCallback(async () => {
    if (!booking) return
    try {
      const response = await api.get<Guest[]>(`/bookings/${booking.id}/guests`)
      setGuests(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao buscar hóspedes.')
    }
  }, [booking])

  useEffect(() => {
    if (isOpen && booking) {
      setEditData({
        responsible_name: booking.responsible_name,
        start_date: booking.start_date.split('T')[0],
        end_date: booking.end_date.split('T')[0],
      })
      loadGuests()
    }
  }, [isOpen, booking, loadGuests])

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return
    setLoading(true)
    try {
      await api.put(`/bookings/${booking.id}`, {
        hotel_id: booking.hotel_id,
        ...editData,
      })
      toast.success('Reserva atualizada!')
      onUpdate()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBooking = async () => {
    if (!booking) return
    const result = await MySwal.fire({
      title: 'Cancelar Reserva?',
      text: `Deseja cancelar a reserva de ${booking.responsible_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Manter',
      customClass: {
        confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-lg ml-2',
        cancelButton: 'bg-gray-200 text-gray-700 px-4 py-2 rounded-lg',
      },
      buttonsStyling: false,
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookings/${booking.id}`)
        toast.success('Reserva cancelada.')
        onUpdate()
        onClose()
      } catch (error) {
        console.error(error)
        toast.error('Erro ao cancelar.')
      }
    }
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return
    setLoadingGuest(true)
    try {
      await api.post('/guests', { booking_id: booking.id, ...newGuest })
      toast.success('Hóspede adicionado!')
      setNewGuest({ name: '', document: '' })
      loadGuests()
      onUpdate()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao adicionar.')
    } finally {
      setLoadingGuest(false)
    }
  }

  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto animate-in zoom-in duration-200 border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                Gerenciar Reserva
              </h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-none">
                {booking.hotel_name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest border-b pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Dados da Estadia
              </h3>

              <form
                id="edit-booking-form"
                onSubmit={handleUpdateBooking}
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 font-sans">
                    Responsável
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-gray-700"
                    value={editData.responsible_name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        responsible_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 font-sans">
                      Check-in
                    </label>
                    <input
                      required
                      type="date"
                      min={today}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium text-gray-600 text-sm"
                      value={editData.start_date}
                      onChange={(e) =>
                        setEditData({ ...editData, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 font-sans">
                      Check-out
                    </label>
                    <input
                      required
                      type="date"
                      min={editData.start_date}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium text-gray-600 text-sm"
                      value={editData.end_date}
                      onChange={(e) =>
                        setEditData({ ...editData, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex flex-col bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-3 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Acompanhantes
                </span>
                <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px]">
                  {guests.length}
                </span>
              </h3>

              <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-1">
                {guests.length === 0 ? (
                  <p className="text-xs italic text-gray-400 text-center py-6">
                    Sem acompanhantes.
                  </p>
                ) : (
                  guests.map((guest) => (
                    <div
                      key={guest.id}
                      className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center transition-all hover:border-primary/30"
                    >
                      <div className="truncate">
                        <p className="font-bold text-xs text-gray-800 uppercase truncate max-w-[140px]">
                          {guest.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono">
                          DOC: {guest.document}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm"></div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleAddGuest}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3"
              >
                <input
                  required
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 text-sm border-b border-gray-100 outline-none"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="Documento"
                    className="w-full px-3 py-2 text-sm border-b border-gray-100 outline-none font-mono"
                    value={newGuest.document}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, document: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    disabled={loadingGuest}
                    className="bg-primary text-white px-4 rounded-lg hover:bg-primary-dark shrink-0"
                  >
                    {loadingGuest ? '...' : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleDeleteBooking}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 text-[12px] font-black uppercase tracking-widest transition-all order-2 md:order-1 outline-none"
            >
              <Trash2 className="w-4 h-4" />
              Cancelar Reserva
            </button>

            <div className="w-full md:w-auto order-1 md:order-2">
              <Button
                type="submit"
                form="edit-booking-form"
                disabled={loading}
                className="w-full md:min-w-[220px] shadow-lg active:scale-95"
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
