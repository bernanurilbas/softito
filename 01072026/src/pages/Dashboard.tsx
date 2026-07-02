import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCustomers } from '../features/customers/customersSlice';
import { fetchDeals } from '../features/deals/dealsSlice';
import { fetchTasks, toggleTaskCompleted } from '../features/tasks/tasksSlice';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.customers.items);
  const deals = useSelector((state: RootState) => state.deals.items);
  const tasks = useSelector((state: RootState) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchDeals());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Statistics Calculation
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  
  const totalDealsValue = deals
    .filter(d => d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const wonDealsCount = deals.filter(d => d.stage === 'won').length;
  const winRate = deals.length > 0 ? Math.round((wonDealsCount / deals.length) * 100) : 0;

  // Chart Data 1: Deal Stages Distribution
  const stageNames: Record<string, string> = {
    new: 'Yeni Başvuru',
    contacted: 'Görüşülüyor',
    proposal_sent: 'Teklif Verildi',
    won: 'Kazanıldı',
    lost: 'Kaybedildi'
  };

  const stageColors: Record<string, string> = {
    new: '#818cf8', // indigo-400
    contacted: '#c084fc', // purple-400
    proposal_sent: '#f59e0b', // amber-500
    won: '#10b981', // emerald-500
    lost: '#ef4444' // red-500
  };

  const stageDistribution = Object.keys(stageNames).map(stageKey => {
    const stageDeals = deals.filter(d => d.stage === stageKey);
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      name: stageNames[stageKey],
      count: stageDeals.length,
      value: value,
      color: stageColors[stageKey]
    };
  });

  // Chart Data 2: Pipeline stages for pie chart
  const pieData = stageDistribution.filter(item => item.count > 0);

  // Quick helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 space-y-8 animate-slide-up text-left">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">CRM Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">İşletmenizin performansına genel bakış.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/customers"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/15 cursor-pointer"
          >
            <Plus size={16} />
            Müşteri Ekle
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Customers */}
        <div className="glassmorphism-card rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Aktif Müşteriler</span>
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-500 dark:text-purple-400 border border-purple-600/20">
              <Users size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{activeCustomers}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Toplam {customers.length} kayıt arasından</p>
        </div>

        {/* Card 2: Sales Pipeline Value */}
        <div className="glassmorphism-card rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Boru Hattı Değeri</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{formatCurrency(totalDealsValue)}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Kaybedilenler hariç tüm fırsatlar</p>
        </div>

        {/* Card 3: Win Rate */}
        <div className="glassmorphism-card rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Kazanma Oranı</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">%{winRate}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Tamamlanan fırsat oranlarına göre</p>
        </div>

        {/* Card 4: Pending Tasks */}
        <div className="glassmorphism-card rounded-2xl p-6 border transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Bekleyen Görevler</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0">{pendingTasks}</h3>
          <p className="text-[11px] text-slate-400 mt-2">Tamamlanan: {completedTasks} görev</p>
        </div>
      </div>

      {/* Visual Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Card */}
        <div className="glassmorphism-card rounded-2xl p-6 border lg:col-span-2">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Aşamalara Göre Satış Fırsat Hacimleri</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageDistribution}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Hacim']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="glassmorphism-card rounded-2xl p-6 border">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4 font-sans">Pipeline Dağılım Oranı</h4>
          <div className="h-64 w-full flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} Fırsat`, 'Adet']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-slate-400 text-sm">Fırsat verisi bulunamadı.</span>
            )}
            <div className="absolute text-center">
              <span className="text-xs text-slate-400 block uppercase tracking-wider">Toplam Fırsat</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{deals.length}</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2 mt-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-400">{item.count} adet ({formatCurrency(item.value)})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widget Section: Today's Tasks & Latest Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks Widget */}
        <div className="glassmorphism-card rounded-2xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white m-0">Yapılacak Görevler</h4>
            <Link to="/tasks" className="text-xs text-purple-500 hover:text-purple-400 font-medium flex items-center gap-1">
              Tümünü Gör
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {tasks.filter(t => !t.completed).length > 0 ? (
              tasks.filter(t => !t.completed).slice(0, 4).map((task) => {
                const client = customers.find(c => c.id === task.customerId);
                return (
                  <div 
                    key={task.id} 
                    className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch(toggleTaskCompleted(task))}
                        className="mt-1 rounded border-slate-300 text-purple-500 focus:ring-purple-500 h-4 w-4 cursor-pointer"
                      />
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug m-0">{task.text}</p>
                        {client && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">Müşteri: {client.name} ({client.company})</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Bekleyen göreviniz bulunmuyor 🎉
              </div>
            )}
          </div>
        </div>

        {/* Latest Opportunities Widget */}
        <div className="glassmorphism-card rounded-2xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white m-0">Son Fırsatlar</h4>
            <Link to="/deals" className="text-xs text-purple-500 hover:text-purple-400 font-medium flex items-center gap-1">
              Boru Hattını Gör
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {deals.slice(0, 4).map((deal) => {
              const client = customers.find(c => c.id === deal.customerId);
              return (
                <div 
                  key={deal.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-500">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 m-0">{deal.title}</p>
                      {client && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 m-0">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-950 dark:text-white m-0">{formatCurrency(deal.value)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${
                      deal.stage === 'won' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      deal.stage === 'lost' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      deal.stage === 'proposal_sent' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-purple-600/10 text-purple-500 border border-purple-600/20'
                    }`}>
                      {stageNames[deal.stage] || deal.stage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
