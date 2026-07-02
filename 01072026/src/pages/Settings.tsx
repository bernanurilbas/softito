import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchSettings, updateSettings, type SystemSettings } from '../features/settings/settingsSlice';
import { 
  Settings as SettingsIcon, 
  Save, 
  Sun, 
  Coins, 
  Layers, 
  CheckCircle2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { config, status } = useSelector((state: RootState) => state.settings);

  const [darkMode, setDarkMode] = useState(config.darkMode);
  const [currency, setCurrency] = useState(config.currency);
  const [pipelineStages, setPipelineStages] = useState<string[]>(config.pipelineStages);
  const [newStage, setNewStage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Keep local state synced with redux state when loaded
  useEffect(() => {
    setDarkMode(config.darkMode);
    setCurrency(config.currency);
    setPipelineStages(config.pipelineStages);
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSettings: SystemSettings = {
      darkMode,
      currency,
      pipelineStages
    };

    dispatch(updateSettings(updatedSettings))
      .unwrap()
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Preview dark mode theme immediately
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddStage = () => {
    if (!newStage.trim()) return;
    const stageKey = newStage.trim().toLowerCase().replace(/\s+/g, '_');
    if (!pipelineStages.includes(stageKey)) {
      setPipelineStages([...pipelineStages, stageKey]);
      setNewStage('');
    }
  };

  const handleRemoveStage = (stageToRemove: string) => {
    setPipelineStages(pipelineStages.filter(stage => stage !== stageToRemove));
  };

  return (
    <div className="p-6 space-y-6 animate-slide-up text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">Sistem Ayarları</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">CRM uygulamasının görünüm, para birimi ve süreç ayarlarını yapılandırın.</p>
      </div>

      <form id="settings-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {showSuccess && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm animate-fade-in">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Ayarlar başarıyla veritabanına kaydedildi.</span>
            </div>
          )}

          {/* Theme Settings Card */}
          <div className="glassmorphism-card rounded-2xl p-6 border space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="text-purple-500" size={18} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Görünüm Ayarları</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 m-0">Koyu Tema (Dark Mode)</p>
                <p className="text-xs text-slate-400 m-0">Uygulama arayüzünü gece moduna geçirin.</p>
              </div>
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  darkMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Financial Currency Card */}
          <div className="glassmorphism-card rounded-2xl p-6 border space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Coins className="text-purple-500" size={18} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Para Birimi Ayarları</h3>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="settings-currency" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Varsayılan Para Birimi</label>
              <select
                id="settings-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-sm"
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">Amerikan Doları ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">İngiliz Sterlini (£)</option>
              </select>
            </div>
          </div>

          {/* Pipeline Stages Card */}
          <div className="glassmorphism-card rounded-2xl p-6 border space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="text-purple-500" size={18} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">Satış Boru Hattı Aşamaları</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-snug">
                Kanban tahtasında görünen aşamaları ekleyin veya kaldırın.
              </p>
              
              <div className="flex flex-wrap gap-2 py-2">
                {pipelineStages.map((stage, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    {stage}
                    <button 
                      type="button"
                      onClick={() => handleRemoveStage(stage)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Stage Control */}
              <div className="flex gap-2">
                <input
                  id="settings-new-stage"
                  type="text"
                  placeholder="Yeni aşama ismi (Örn: Sözleşme İmzalandı)"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-600 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-750"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Status Check / Action */}
        <div className="space-y-6">
          <div className="glassmorphism-card rounded-2xl p-6 border space-y-4">
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-600/10 text-purple-500 mb-2">
                <SettingsIcon size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">Aksiyon Merkezi</h4>
              <p className="text-xs text-slate-400 mt-1">Yapılan değişiklikleri sisteme kaydedin.</p>
            </div>
            
            <button
              id="settings-save-button"
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-colors cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              <Save size={16} />
              {status === 'loading' ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Settings;
