import React, { useState, useEffect } from 'react';
import { X, Save, Building2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { Button } from './Button';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import type { Hotel, HotelFormData } from '../types';

const MySwal = withReactContent(Swal);

interface ManageHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  hotel: Hotel | null;
}

export const ManageHotelModal: React.FC<ManageHotelModalProps> = ({ isOpen, onClose, onUpdate, hotel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    city: '',
    address: '',
    stars: 3,
    total_rooms: 10,
    description: '',
    photo_url: ''
  });

  useEffect(() => {
    if (isOpen && hotel) {
      setFormData({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        stars: hotel.stars || 3,
        total_rooms: hotel.total_rooms || 10,
        description: hotel.description || '',
        photo_url: hotel.photo_url || ''
      });
    }
  }, [isOpen, hotel]);

  if (!isOpen || !hotel) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/hotels/${hotel.id}`, formData);
      toast.success('Hotel atualizado com sucesso!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Erro ao atualizar hotel.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: <p className="text-2xl font-bold text-gray-800">Remover Hotel?</p>,
      html: (
        <div className="text-gray-600">
          Esta ação é irreversível. Ao excluir o <b>{hotel.name}</b>, todas as reservas e hóspedes vinculados serão apagados.
        </div>
      ),
      icon: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: 'Sim, excluir tudo',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl border-none',
        confirmButton: 'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer mx-2 bg-red-500 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
        cancelButton:  'flex items-center justify-center gap-2 py-3 px-6 rounded-lg shadow-md text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer mx-2 bg-green-600 text-white border border-transparent hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/hotels/${hotel.id}`);
        toast.success('Hotel removido com sucesso!');
        onUpdate();
        onClose();
      } catch (error) {
        console.error('Delete Error:', error);
        toast.error('Erro ao excluir hotel.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg"><Building2 className="w-6 h-6 text-primary" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Gerenciar Unidade</h2>
              <p className="text-sm text-gray-500">Edite as informações ou remova o hotel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="manage-hotel-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Hotel *</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classificação *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none cursor-pointer" value={formData.stars} onChange={e => setFormData({...formData, stars: Number(e.target.value)})}>
                {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} Estrelas</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total de Quartos *</label>
              <input required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.total_rooms} onChange={e => setFormData({...formData, total_rooms: Number(e.target.value)})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
              <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.photo_url || ''} onChange={e => setFormData({...formData, photo_url: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={handleDelete} 
            className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-500 text-sm font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer outline-none"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Hotel
          </button>
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-bold uppercase tracking-wider hover:text-red-500 transition-all cursor-pointer outline-none shadow-sm"
            >
              Voltar
            </button>
            <Button 
              type="submit" 
              form="manage-hotel-form" 
              disabled={loading}
              className="cursor-pointer"
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