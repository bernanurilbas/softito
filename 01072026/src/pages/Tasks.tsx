import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchCustomers } from '../features/customers/customersSlice';
import { fetchTasks, addTask, toggleTaskCompleted, deleteTask } from '../features/tasks/tasksSlice';
import { 
  Plus, 
  Trash2, 
  X, 
  CheckSquare, 
  Square,
  Calendar,
  Building,
  ListTodo
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const customers = useSelector((state: RootState) => state.customers.items);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Form State
  const [taskText, setTaskText] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-07-15');

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText || !customerId) return;

    dispatch(addTask({
      customerId,
      text: taskText,
      priority: taskPriority,
      completed: false,
      dueDate: taskDueDate
    }));

    setIsModalOpen(false);
    setTaskText('');
    setCustomerId('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      dispatch(deleteTask(id));
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'completed' ? task.completed : !task.completed;

    const matchesPriority = 
      priorityFilter === 'all' ? true : task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6 animate-slide-up text-left">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Görev Takibi</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Müşterilerle ilgili yapılacak işlerinizi planlayın ve takip edin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/15 cursor-pointer"
        >
          <Plus size={16} />
          Yeni Görev Ekle
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40">
        
        {/* Status Filter */}
        <div className="flex-1 flex flex-col text-left space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Durum Filtresi</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Yapılacaklar
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Tamamlananlar
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="shrink-0 flex flex-col text-left space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Öncelik Filtresi</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                priorityFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                priorityFilter === 'high'
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Yüksek
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                priorityFilter === 'medium'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Orta
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                priorityFilter === 'low'
                  ? 'bg-slate-500/10 text-slate-400 border-slate-300'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              Düşük
            </button>
          </div>
        </div>

      </div>

      {/* Task List Grid Card */}
      <div className="glassmorphism-card rounded-2xl border p-6 shadow-sm space-y-4">
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTasks.map((task) => {
              const client = customers.find(c => c.id === task.customerId);

              return (
                <div 
                  key={task.id} 
                  className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 animate-fade-in group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => dispatch(toggleTaskCompleted(task))}
                      className="mt-0.5 text-slate-400 hover:text-purple-500 transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare size={18} className="text-purple-500" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                    
                    <div className="text-left flex-1 min-w-0">
                      <p className={`text-sm font-semibold m-0 leading-snug ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : 'text-slate-850 dark:text-slate-200'
                      }`}>
                        {task.text}
                      </p>
                      
                      {/* Connected Details */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                        {client && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Building size={11} />
                            <span>{client.company} ({client.name})</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar size={11} />
                          <span>Son Tarih: {task.dueDate}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Priority badge */}
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>

                    {/* Delete Task */}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-400 hover:text-rose-500 hover:border-rose-500/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Görevi Sil"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <ListTodo size={32} className="text-slate-300" />
            <span>Filtrelere uygun görev bulunmamaktadır.</span>
          </div>
        )}
      </div>

      {/* --- ADD TASK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Yeni Görev Ataması</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form id="add-task-form" onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="add-task-customer" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">İlişkili Müşteri *</label>
                <select
                  id="add-task-customer"
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                >
                  <option value="">Müşteri Seçiniz...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="add-task-text" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Görev Açıklaması *</label>
                <input
                  id="add-task-text"
                  type="text"
                  required
                  placeholder="Satış sözleşmesini imzalat"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="add-task-priority" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Öncelik Derecesi</label>
                  <select
                    id="add-task-priority"
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
                  <label htmlFor="add-task-due-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Tarih</label>
                  <input
                    id="add-task-due-date"
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
                  onClick={() => setIsModalOpen(false)}
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

export default Tasks;
