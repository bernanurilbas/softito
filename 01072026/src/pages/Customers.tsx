import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../app/store';
import { 
  fetchCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer,
  type Customer 
} from '../features/customers/customersSlice';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Mail, 
  Phone, 
  Building,
  Eye,
  Loader
} from 'lucide-react';

export const Customers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: customers, status } = useSelector((state: RootState) => state.customers);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormName('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('active');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormName(customer.name);
    setFormCompany(customer.company);
    setFormEmail(customer.email);
    setFormPhone(customer.phone);
    setFormStatus(customer.status);
    setIsEditModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCompany || !formEmail) return;

    // Default avatars based on name seed
    const avatarNum = Math.floor(Math.random() * 70) + 1;
    const defaultAvatar = `https://i.pravatar.cc/150?img=${avatarNum}`;

    dispatch(addCustomer({
      name: formName,
      company: formCompany,
      email: formEmail,
      phone: formPhone || '+90 500 000 00 00',
      status: formStatus,
      avatar: defaultAvatar
    }));
    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !formName || !formCompany || !formEmail) return;

    dispatch(updateCustomer({
      ...selectedCustomer,
      name: formName,
      company: formCompany,
      email: formEmail,
      phone: formPhone,
      status: formStatus,
    }));
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  // Delete Customer
  const handleDelete = (id: string) => {
    if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      dispatch(deleteCustomer(id));
    }
  };

  // Filtered list
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase()) || 
                          customer.company.toLowerCase().includes(search.toLowerCase()) ||
                          customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 animate-slide-up text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Müşteriler</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Müşteri portföyünüzü ve iletişim bilgilerini yönetin.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/15 cursor-pointer"
        >
          <Plus size={16} />
          Yeni Müşteri Ekle
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            id="customer-search-input"
            type="text"
            placeholder="Müşteri adı, şirket veya e-posta arayın..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-colors text-sm"
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-slate-500 text-white border-slate-500 shadow-md shadow-slate-500/10'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            Pasif
          </button>
        </div>
      </div>

      {/* Main Customers List/Table */}
      <div className="glassmorphism-card rounded-2xl border overflow-hidden shadow-sm">
        {status === 'loading' && customers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader size={28} className="animate-spin mb-2" />
            <span>Müşteriler Yükleniyor...</span>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Şirket</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors group"
                  >
                    {/* User profile / Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar} 
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" 
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white m-0">{customer.name}</p>
                          <span className="text-xs text-slate-400">ID: #{customer.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Building size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">{customer.company}</span>
                      </div>
                    </td>

                    {/* Email / Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Mail size={12} />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Phone size={12} />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        customer.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {customer.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-purple-500 hover:border-purple-500/30 transition-all"
                          title="Müşteri Detayı"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(customer)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all cursor-pointer"
                          title="Müşteri Düzenle"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
                          title="Müşteri Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            Aradığınız kriterlere uygun müşteri bulunamadı.
          </div>
        )}
      </div>

      {/* --- ADD CUSTOMER MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Yeni Müşteri Ekle</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form id="add-customer-form" onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="add-customer-name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ad Soyad *</label>
                <input
                  id="add-customer-name"
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="add-customer-company" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Şirket Adı *</label>
                <input
                  id="add-customer-company"
                  type="text"
                  required
                  placeholder="Kuzey Yazılım A.Ş."
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="add-customer-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-Posta Adresi *</label>
                  <input
                    id="add-customer-email"
                    type="email"
                    required
                    placeholder="ahmet@kuzeyyazilim.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="add-customer-phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</label>
                  <input
                    id="add-customer-phone"
                    type="text"
                    placeholder="+90 532 123 45 67"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="add-customer-status" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</label>
                <select
                  id="add-customer-status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 text-sm font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT CUSTOMER MODAL --- */}
      {isEditModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Müşteri Bilgilerini Düzenle</h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form id="edit-customer-form" onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="edit-customer-name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ad Soyad *</label>
                <input
                  id="edit-customer-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="edit-customer-company" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Şirket Adı *</label>
                <input
                  id="edit-customer-company"
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="edit-customer-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-Posta Adresi *</label>
                  <input
                    id="edit-customer-email"
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="edit-customer-phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</label>
                  <input
                    id="edit-customer-phone"
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="edit-customer-status" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</label>
                <select
                  id="edit-customer-status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 text-sm font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 cursor-pointer"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
