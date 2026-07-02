import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCustomers } from '../features/customers/customersSlice';
import { fetchDeals, addDeal, updateDeal, deleteDeal, type Deal } from '../features/deals/dealsSlice';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Building,
  User,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

export const Deals: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deals = useSelector((state: RootState) => state.deals.items);
  const customers = useSelector((state: RootState) => state.customers.items);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [dealStage, setDealStage] = useState('new');
  const [dealCloseDate, setDealCloseDate] = useState('2026-07-31');

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchDeals());
  }, [dispatch]);

  const stages = [
    { key: 'new', name: 'Yeni Başvuru', color: 'border-t-purple-500 bg-purple-500/5' },
    { key: 'contacted', name: 'Görüşülüyor', color: 'border-t-indigo-500 bg-indigo-500/5' },
    { key: 'proposal_sent', name: 'Teklif Verildi', color: 'border-t-amber-500 bg-amber-500/5' },
    { key: 'won', name: 'Kazanıldı', color: 'border-t-emerald-500 bg-emerald-500/5' },
    { key: 'lost', name: 'Kaybedildi', color: 'border-t-rose-500 bg-rose-500/5' }
  ];

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealValue || !customerId) return;

    dispatch(addDeal({
      customerId,
      title: dealTitle,
      value: Number(dealValue),
      stage: dealStage,
      expectedCloseDate: dealCloseDate
    }));

    setIsModalOpen(false);
    setDealTitle('');
    setDealValue('');
    setCustomerId('');
  };

  const handleMoveStage = (deal: Deal, newStage: string) => {
    dispatch(updateDeal({
      ...deal,
      stage: newStage
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu satış fırsatını silmek istediğinize emin misiniz?')) {
      dispatch(deleteDeal(id));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 space-y-6 animate-slide-up text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Satış Boru Hattı</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Satış fırsatlarını, teklifleri ve aşamaları takip edin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/15 cursor-pointer"
        >
          <Plus size={16} />
          Yeni Fırsat Ekle
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage.key);
          const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div 
              key={stage.key} 
              className={`flex flex-col min-w-[220px] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 border-t-4 p-4 shadow-xs h-[600px] ${stage.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 m-0">{stage.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                  {stageDeals.length}
                </span>
              </div>
              
              <div className="mb-4 text-xs font-semibold text-slate-400">
                Toplam: {formatCurrency(stageTotalValue)}
              </div>

              {/* Cards Wrapper */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageDeals.map((deal) => {
                  const client = customers.find(c => c.id === deal.customerId);
                  
                  return (
                    <div 
                      key={deal.id} 
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xs hover:shadow-md transition-all group relative animate-fade-in"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug tracking-tight text-left">
                        {deal.title}
                      </h4>
                      
                      <div className="space-y-1.5 text-left mb-3">
                        {client && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            <Building size={11} className="shrink-0" />
                            <span className="truncate">{client.company}</span>
                          </div>
                        )}
                        {client && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <User size={11} className="shrink-0" />
                            <span className="truncate">{client.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Calendar size={11} className="shrink-0" />
                          <span>{deal.expectedCloseDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(deal.value)}
                        </span>
                        
                        {/* Quick Delete */}
                        <button
                          onClick={() => handleDelete(deal.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Moving Controls on bottom hover */}
                      <div className="flex justify-between items-center mt-3 gap-1">
                        {/* Move Left */}
                        <button
                          disabled={stage.key === 'new'}
                          onClick={() => {
                            const prevStages = ['new', 'contacted', 'proposal_sent', 'won', 'lost'];
                            const idx = prevStages.indexOf(stage.key);
                            if (idx > 0) handleMoveStage(deal, prevStages[idx - 1]);
                          }}
                          className="flex-1 flex items-center justify-center p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[9px] cursor-pointer"
                          title="Önceki Aşamaya Taşı"
                        >
                          <ArrowLeft size={10} />
                        </button>

                        {/* Move Right */}
                        <button
                          disabled={stage.key === 'lost' || stage.key === 'won'}
                          onClick={() => {
                            const nextStages = ['new', 'contacted', 'proposal_sent', 'won', 'lost'];
                            const idx = nextStages.indexOf(stage.key);
                            if (idx < nextStages.length - 1) handleMoveStage(deal, nextStages[idx + 1]);
                          }}
                          className="flex-1 flex items-center justify-center p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[9px] cursor-pointer"
                          title="Sonraki Aşamaya Taşı"
                        >
                          <ArrowRight size={10} />
                        </button>
                      </div>

                    </div>
                  );
                })}
                {stageDeals.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    Fırsat yok
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD DEAL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Yeni Satış Fırsatı Ekle</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form id="add-deal-form" onSubmit={handleCreateDeal} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="add-deal-customer" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">İlişkili Müşteri *</label>
                <select
                  id="add-deal-customer"
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                >
                  <option value="">Seçiniz...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="add-deal-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fırsat Başlığı *</label>
                <input
                  id="add-deal-title"
                  type="text"
                  required
                  placeholder="Mobil Uygulama Geliştirme Projesi"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="add-deal-value" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Değer (TL) *</label>
                <input
                  id="add-deal-value"
                  type="number"
                  required
                  placeholder="30000"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="add-deal-stage" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aşama</label>
                  <select
                    id="add-deal-stage"
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  >
                    <option value="new">Yeni Başvuru</option>
                    <option value="contacted">Görüşülüyor</option>
                    <option value="proposal_sent">Teklif Verildi</option>
                    <option value="won">Kazanıldı</option>
                    <option value="lost">Kaybedildi</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="add-deal-close-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tahmini Kapanış</label>
                  <input
                    id="add-deal-close-date"
                    type="date"
                    value={dealCloseDate}
                    onChange={(e) => setDealCloseDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 cursor-pointer"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
