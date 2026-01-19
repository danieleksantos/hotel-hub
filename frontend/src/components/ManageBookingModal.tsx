import React, { useState, useEffect, useCallback } from 'react'
import {
  X,
  Calendar,
  Trash2,
  Users,
  Plus,
  CreditCard,
  Save,
  Edit2,
  Check,
  AlertCircle,
} from 'lucide-react'
import api from '../services/api'
import { Button } from './Button'
import { toast } from 'react-toastify'
import { alertService } from '../services/sweetAlert'
import type { Booking, Guest } from '../types'

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
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null)
  const [guestEditForm, setGuestEditForm] = useState({ name: '', document: '' })
  const today = new Date().toISOString().split('T')[0]
  const isNameValid = (name: string) => name.trim().length >= 3
  const isDocValid = (doc: string) => doc.trim().length >= 9

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
      setEditingGuestId(null)
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

    const result = await alertService.destructive(
      'Cancelar Reserva?',
      `Deseja realmente cancelar a reserva de <b>${booking.responsible_name}</b>? Esta ação não pode ser desfeita.`,
    )

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookings/${booking.id}`)
        toast.success('Reserva cancelada com sucesso!')
        onUpdate()
        onClose()
      } catch (error) {
        console.error(error)
        toast.error('Erro ao cancelar reserva.')
      }
    }
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isNameValid(newGuest.name) || !isDocValid(newGuest.document)) return
    setLoadingGuest(true)
    try {
      await api.post('/guests', { booking_id: booking?.id, ...newGuest })
      toast.success('Hóspede adicionado!')
      setNewGuest({ name: '', document: '' })
      loadGuests()
      onUpdate()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao adicionar acompanhante.')
    } finally {
      setLoadingGuest(false)
    }
  }

  const handleDeleteGuest = async (guest: Guest) => {
    const result = await alertService.destructive(
      'Remover acompanhante?',
      `Tem certeza que deseja remover <b>${guest.name}</b> desta reserva?`,
    )

    if (result.isConfirmed) {
      try {
        await api.delete(`/guests/${guest.id}`)
        toast.success('Removido.')
        loadGuests()
        onUpdate()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleUpdateGuest = async (id: string) => {
    if (!isNameValid(guestEditForm.name) || !isDocValid(guestEditForm.document))
      return
    try {
      await api.put(`/guests/${id}`, guestEditForm)
      toast.success('Atualizado!')
      setEditingGuestId(null)
      loadGuests()
      onUpdate()
    } catch (error) {
      console.error(error)
    }
  }

  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto border border-gray-100 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
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
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-all cursor-pointer outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest border-b pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Dados da Estadia
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-gray-700"
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
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest font-sans">
                    Check-in
                  </label>
                  <input
                    type="date"
                    min={today}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm cursor-pointer"
                    value={editData.start_date}
                    onChange={(e) =>
                      setEditData({ ...editData, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest font-sans">
                    Check-out
                  </label>
                  <input
                    type="date"
                    min={editData.start_date}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm cursor-pointer"
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
                <Users className="w-4 h-4 text-primary" /> Acompanhantes
              </span>
              <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px]">
                {guests.length}
              </span>
            </h3>

            <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
                >
                  {editingGuestId === guest.id ? (
                    <div className="space-y-2">
                      <input
                        className="w-full px-3 py-2 text-xs border rounded-lg focus:border-primary outline-none"
                        value={guestEditForm.name}
                        onChange={(e) =>
                          setGuestEditForm({
                            ...guestEditForm,
                            name: e.target.value,
                          })
                        }
                      />
                      {!isNameValid(guestEditForm.name) && (
                        <p className="text-[9px] text-red-500 font-bold">
                          Nome obrigatório (mín. 3 letras)
                        </p>
                      )}
                      <div className="flex gap-2">
                        <input
                          className="w-full px-3 py-2 text-[10px] border rounded-lg font-mono"
                          value={guestEditForm.document}
                          onChange={(e) =>
                            setGuestEditForm({
                              ...guestEditForm,
                              document: e.target.value,
                            })
                          }
                        />
                        <button
                          disabled={
                            !isNameValid(guestEditForm.name) ||
                            !isDocValid(guestEditForm.document)
                          }
                          onClick={() => handleUpdateGuest(guest.id)}
                          className="bg-green-500 text-white px-3 rounded-lg cursor-pointer disabled:opacity-30"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingGuestId(null)}
                          className="bg-gray-100 text-gray-500 px-3 rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {!isDocValid(guestEditForm.document) && (
                        <p className="text-[9px] text-red-500 font-bold">
                          Documento obrigatório (mín. 9 dígitos)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-2">
                      <div className="truncate flex-1">
                        <p className="font-bold text-[11px] text-gray-800 uppercase truncate">
                          {guest.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono font-black uppercase">
                          DOC: {guest.document}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingGuestId(guest.id)
                            setGuestEditForm({
                              name: guest.name,
                              document: guest.document,
                            })
                          }}
                          className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-all active:scale-90"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest)}
                          className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-all active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddGuest}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3"
            >
              <div>
                <input
                  placeholder="Nome do acompanhante"
                  className={`w-full px-3 py-2 text-sm border-b outline-none transition-colors ${newGuest.name && !isNameValid(newGuest.name) ? 'border-red-500' : 'border-gray-100 focus:border-primary'}`}
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                />
                {newGuest.name && !isNameValid(newGuest.name) && (
                  <span className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Nome obrigatório
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    placeholder="Documento (mín. 9)"
                    className={`w-full px-3 py-2 text-sm border-b outline-none font-mono transition-colors ${newGuest.document && !isDocValid(newGuest.document) ? 'border-red-500' : 'border-gray-100 focus:border-primary'}`}
                    value={newGuest.document}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, document: e.target.value })
                    }
                  />
                  {newGuest.document && !isDocValid(newGuest.document) && (
                    <span className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Documento obrigatório
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={
                    !isNameValid(newGuest.name) ||
                    !isDocValid(newGuest.document) ||
                    loadingGuest
                  }
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark cursor-pointer disabled:opacity-40 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDeleteBooking}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                         text-red-500 bg-red-50 border border-red-100 text-[12px] font-black 
                         uppercase tracking-widest hover:bg-red-500 hover:text-white 
                         transition-all duration-300 cursor-pointer outline-none active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> Cancelar Reserva
          </button>
          <Button
            type="submit"
            form="edit-booking-form"
            disabled={loading}
            className="w-full md:w-auto shadow-lg cursor-pointer active:scale-95"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}{' '}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
