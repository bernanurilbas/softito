import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCustomers } from '../features/customers/customersSlice';
import { fetchDeals, addDeal } from '../features/deals/dealsSlice';
import { fetchTasks, addTask, toggleTaskCompleted } from '../features/tasks/tasksSlice';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  MessageSquare, 
  AlertCircle
} from 'lucide-react';

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const customers = useSelector((state: RootState) => state.customers.items);
  const deals = useSelector((state: RootState) => state.deals.items);
  const tasks = useSelector((state: RootState) => state.tasks.items);

  const customer = customers.find(c => c.id === id);

  // Local state for custom notes
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');

  // Quick modals for adding deal / task from details page
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Deal Form State
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [dealStage, setDealStage] = useState('new');
  const [dealCloseDate, setDealCloseDate] = useState('2026-07-31');

  // Task Form State
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-07-15');

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchDeals());
    dispatch(fetchTasks());

    // Load customer notes from localStorage
    if (id) {
      const storedNotes = localStorage.getItem(`crm_notes_${id}`);
      if (storedNotes) {
        try {
          setNotes(JSON.parse(storedNotes));
        } catch {
          setNotes([]);
        }
      }
    }
  }, [dispatch, id]);

  if (!customer) {
    return (
      <div className="p-8 text-center animate-slide-up text-left">
        <Link to="/customers" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft size={16} />
          Müşterilere Geri Dön
        </Link>
        <div className="p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl flex flex-col items-center gap-3">
          <AlertCircle size={32} className="text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">Müşteri Bulunamadı</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Aradığınız müşteri veri tabanında mevcut değil.</p>
        </div>
      </div>
    );
  }

  // Filter deals and tasks for this customer
  const customerDeals = deals.filter(d => d.customerId === customer.id);
  const customerTasks = tasks.filter(t => t.customerId === customer.id);

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !id) return;

    const newNote: Note = {
      id: String(Date.now()),
      text: noteText,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`crm_notes_${id}`, JSON.stringify(updatedNotes));
    setNoteText('');
  };

  // Submit Deal
  const handleDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealValue || !id) return;

    dispatch(addDeal({
      customerId: id,
      title: dealTitle,
      value: Number(dealValue),
      stage: dealStage,
      expectedCloseDate: dealCloseDate
    }));

    setIsDealModalOpen(false);
    setDealTitle('');
    setDealValue('');
  };

  // Submit Task
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText || !id) return;

    dispatch(addTask({
      customerId: id,
      text: taskText,
      priority: taskPriority,
      completed: false,
      dueDate: taskDueDate
    }));

    setIsTaskModalOpen(false);
    setTaskText('');
  };

  // Combined timeline items
  const timelineItems = [
    ...customerDeals.map(d => ({
      id: `deal-${d.id}`,
      type: 'deal',
      title: 'Satış Fırsatı Eklendi',
      text: `${d.title} (${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(d.value)})`,
      date: d.expectedCloseDate,
      icon: DollarSign,
      colorClass: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
    })),
    ...customerTasks.map(t => ({
      id: `task-${t.id}`,
      type: 'task',
      title: t.completed ? 'Görev Tamamlandı' : 'Görev Tanımlandı',
      text: t.text,
      date: t.dueDate,
      icon: CheckCircle2,
      colorClass: t.completed 
        ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' 
        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    })),
    ...notes.map(n => ({
      id: `note-${n.id}`,
      type: 'note',
      title: 'Not Eklendi',
      text: n.text,
      date: n.createdAt.slice(0, 10),
      icon: MessageSquare,
      colorClass: 'bg-purple-600/10 text-purple-500 border border-purple-600/20'
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-6 space-y-8 animate-slide-up text-left">
      {/* Back button */}
      <div>
        <Link to="/customers" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft size={16} />
          Müşterilere Geri Dön
        </Link>
      </div>

      {/* Main Grid: Client Info vs Timeline/Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Contact Information Card */}
        <div className="space-y-6">
          <div className="glassmorphism-card rounded-2xl p-6 border text-center">
            <img 
              src={customer.avatar} 
              alt={customer.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border border-slate-200 dark:border-slate-800 shadow-md mb-4" 
            />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white m-0">{customer.name}</h3>
            <p className="text-xs text-purple-500 font-semibold uppercase tracking-wider mt-1">{customer.company}</p>
            
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                customer.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {customer.status === 'active' ? 'Aktif Portföy' : 'Pasif Portföy'}
              </span>
            </div>

            {/* Contact Details */}
            <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/40 text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">E-Posta</span>
                  <a href={`mailto:${customer.email}`} className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-purple-500 transition-colors">{customer.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Telefon</span>
                  <a href={`tel:${customer.phone}`} className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-purple-500 transition-colors">{customer.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <Building size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Firma</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{customer.company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="glassmorphism-card rounded-2xl p-6 border space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white m-0">Özet İstatistikler</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fırsatlar</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{customerDeals.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Açık İşler</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{customerTasks.filter(t => !t.completed).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Deals, Tasks & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Associated Deals & Tasks grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Opportunities List Card */}
            <div className="glassmorphism-card rounded-2xl p-6 border flex flex-col h-80">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white m-0">Satış Fırsatları</h4>
                <button
                  onClick={() => setIsDealModalOpen(true)}
                  className="p-1.5 rounded-lg bg-purple-600/10 text-purple-500 hover:bg-purple-600/20 border border-purple-600/20 transition-all cursor-pointer"
                  title="Yeni Fırsat Ekle"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {customerDeals.length > 0 ? (
                  customerDeals.map(deal => (
                    <div key={deal.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 m-0">{deal.title}</p>
                        <span className="text-[10px] text-slate-400">Tarih: {deal.expectedCloseDate}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900 dark:text-white m-0">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(deal.value)}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-600/10 text-purple-500 border border-purple-600/20 font-medium capitalize mt-1 inline-block">
                          {deal.stage === 'proposal_sent' ? 'Teklif Verildi' : deal.stage}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Fırsat kaydı bulunmuyor.
                  </div>
                )}
              </div>
            </div>

            {/* Task Tracking Card */}
            <div className="glassmorphism-card rounded-2xl p-6 border flex flex-col h-80">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white m-0">Görevler</h4>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-1.5 rounded-lg bg-purple-600/10 text-purple-500 hover:bg-purple-600/20 border border-purple-600/20 transition-all cursor-pointer"
                  title="Yeni Görev Ekle"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {customerTasks.length > 0 ? (
                  customerTasks.map(task => (
                    <div key={task.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => dispatch(toggleTaskCompleted(task))}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className={`text-xs font-medium m-0 leading-tight ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.text}
                        </p>
                        <span className="text-[9px] text-slate-400 block mt-1">Son Tarih: {task.dueDate}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    Görev kaydı bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Note Add section */}
          <div className="glassmorphism-card rounded-2xl p-6 border">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Görüşme Notu Ekle</h4>
            <form id="details-quick-note-form" onSubmit={handleAddNote} className="flex gap-2">
              <input
                id="details-quick-note-input"
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Örn: Müşteri fiyat teklifini beğendi, haftaya dönecek..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-600 text-sm"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/10"
              >
                <Plus size={16} />
                Ekle
              </button>
            </form>
          </div>

          {/* Timeline of interactions */}
          <div className="glassmorphism-card rounded-2xl p-6 border">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Müşteri Etkileşim Zaman Tüneli</h4>
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-6">
              {timelineItems.length > 0 ? (
                timelineItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="relative pl-6 group">
                      {/* Timeline Dot Icon */}
                      <span className={`absolute left-0 -translate-x-1/2 p-1.5 rounded-full flex items-center justify-center ${item.colorClass}`}>
                        <Icon size={12} />
                      </span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug m-0">{item.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="pl-6 text-slate-400 text-sm text-left">
                  Henüz bir etkileşim kaydı bulunmuyor.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- ADD OPPORTUNITY MODAL --- */}
      {isDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0 font-sans">Yeni Satış Fırsatı Tanımla</h3>
              <button onClick={() => setIsDealModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                <ArrowLeft size={18} />
              </button>
            </div>
            <form id="details-add-deal-form" onSubmit={handleDealSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="details-add-deal-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fırsat Başlığı *</label>
                <input
                  id="details-add-deal-title"
                  type="text"
                  required
                  placeholder="Yıllık Sunucu Barındırma Paketi"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label htmlFor="details-add-deal-value" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Teklif Değeri (TL) *</label>
                <input
                  id="details-add-deal-value"
                  type="number"
                  required
                  placeholder="15000"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="details-add-deal-stage" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aşama</label>
                  <select
                    id="details-add-deal-stage"
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
                  <label htmlFor="details-add-deal-close-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kapanış Tarihi</label>
                  <input
                    id="details-add-deal-close-date"
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
                  onClick={() => setIsDealModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 cursor-pointer"
                >
                  Fırsat Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD TASK MODAL --- */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Yeni Görev Ataması</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                <ArrowLeft size={18} />
              </button>
            </div>
            <form id="details-add-task-form" onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="details-add-task-text" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Görev Metni *</label>
                <input
                  id="details-add-task-text"
                  type="text"
                  required
                  placeholder="Fiyat teklifi detayları için e-posta gönderilecek"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="details-add-task-priority" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Öncelik Derecesi</label>
                  <select
                    id="details-add-task-priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  >
                    <option value="high">Yüksek</option>
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="details-add-task-due-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Tarih</label>
                  <input
                    id="details-add-task-due-date"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 cursor-pointer"
                >
                  Görev Tanımla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
