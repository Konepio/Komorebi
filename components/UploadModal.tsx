
import React, { useState } from 'react';
import { X, ChevronRight, Check, Clover, Sparkles, Terminal } from 'lucide-react';
import { WorkLanguage, Sensitivity, UserRole } from '../types';
import { LANGUAGE_ICONS, SENSITIVITY_ICONS } from '../constants.tsx';
import { useApp } from '../store.tsx';
import { getCuratorialFeedback } from '../services/gemini.ts';

interface UploadModalProps {
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const { addWork, currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    language: WorkLanguage.AUDIOVISUAL,
    contentUrl: '',
    intent: '',
    sensitivities: [] as Sensitivity[],
    thumbnail: ''
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.contentUrl || !formData.intent) {
      alert("Please complete the required fields.");
      return;
    }

    setLoading(true);
    const aiFeedback = await getCuratorialFeedback(formData.intent, formData.title);
    setFeedback(aiFeedback || "");
    
    addWork({
      ...formData,
      authorId: currentUser?.id || 'anon',
      authorName: currentUser?.name || 'Anonymous',
    });

    setStep(3);
    setLoading(false);
  };

  const toggleSensitivity = (s: Sensitivity) => {
    setFormData(prev => ({
      ...prev,
      sensitivities: prev.sensitivities.includes(s) 
        ? prev.sensitivities.filter(i => i !== s) 
        : [...prev.sensitivities, s]
    }));
  };

  const sensitivityLabels: Record<string, string> = {
    'miedo': 'Fear',
    'violencia': 'Violence',
    'sexualidad': 'Sexuality',
    'perturbación psicológica': 'Psychological',
    'consumo o exceso': 'Excess'
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-black shadow-[10px_10px_0px_black] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300">
        <div className="space-header flex justify-between items-center bg-[#1a237e] text-white p-3 border-b-2 border-black">
          <div className="flex items-center gap-3">
             <Terminal size={18} />
             <h2 className="text-xs font-mono font-bold uppercase tracking-widest">New Node Syncing...</h2>
          </div>
          <button onClick={onClose} className="p-1 border border-white hover:bg-white hover:text-black transition-colors"><X size={14} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 font-mono text-xs">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(WorkLanguage).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setFormData({ ...formData, language: lang })}
                    className={`flex flex-col items-center gap-4 p-4 border transition-all ${
                      formData.language === lang 
                      ? 'bg-zinc-900 text-white border-black scale-105 shadow-[4px_4px_0px_black]' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100'
                    }`}
                  >
                    <div>{LANGUAGE_ICONS[lang]}</div>
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      {lang === 'audiovisual' ? 'AUDIOVISUAL' : lang === 'auditivo' ? 'AUDITORY' : lang === 'visual' ? 'VISUAL' : 'ESSAY'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Work Title</label>
                  <input 
                    type="text" 
                    placeholder="SYSTEM_TITLE_INPUT..." 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-mono text-lg focus:border-black outline-none transition-all uppercase"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Content URL / Body Text</label>
                  <textarea 
                    rows={formData.language === WorkLanguage.ESSAY ? 10 : 3}
                    placeholder={formData.language === WorkLanguage.ESSAY ? "Write your essay here..." : "https://..."} 
                    value={formData.contentUrl}
                    onChange={e => setFormData({ ...formData, contentUrl: e.target.value })}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-mono text-xs focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-[#1a237e] text-white border-2 border-black font-bold uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[4px_4px_0px_black]"
              >
                PROCEED_TO_CONTEXT <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500 text-left">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Aesthetic Intent (REQUIRED)</label>
                <textarea 
                  rows={6}
                  value={formData.intent}
                  onChange={e => setFormData({ ...formData, intent: e.target.value })}
                  placeholder="Why does this work exist?"
                  className="w-full bg-white border-2 border-black p-6 italic font-serif text-xl leading-relaxed text-zinc-700 shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Content Warning</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Sensitivity).map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSensitivity(s)}
                      className={`flex items-center gap-3 px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-all ${
                        formData.sensitivities.includes(s)
                        ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                      }`}
                    >
                      {SENSITIVITY_ICONS[s]}
                      {sensitivityLabels[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-zinc-100 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-4 bg-emerald-600 text-white border-2 border-black font-bold uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[4px_4px_0px_black]"
                >
                  {loading ? 'SYNCING_DATA...' : 'ESTABLISH_NODE'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in zoom-in duration-500 text-center py-6">
              <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                 <Check size={40} strokeWidth={3} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-mono font-bold uppercase italic">Sync Complete.</h2>
                <p className="text-zinc-400 text-[11px] max-w-sm mx-auto leading-relaxed uppercase">
                  Your work has been integrated into the living archive of Komorebi. Remaining is a curated act.
                </p>
              </div>
              
              {feedback && (
                <div className="p-8 bg-zinc-900 text-white border-2 border-black text-left relative overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
                  <h3 className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-emerald-400 mb-6 flex items-center gap-2">
                    <Sparkles size={12} />
                    CURATORIAL_ECHO
                  </h3>
                  <p className="text-zinc-200 italic font-serif text-2xl leading-relaxed">
                    "{feedback}"
                  </p>
                </div>
              )}

              <button 
                onClick={onClose}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_black]"
              >
                RETURN_TO_ARCHIVE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
