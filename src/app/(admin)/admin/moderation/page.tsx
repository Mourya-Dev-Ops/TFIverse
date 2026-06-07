'use client';

import { useState, useEffect } from 'react';
import { getPendingMemes, approveMeme, rejectMeme } from '@/app/actions/memes';
import { getPendingReports, resolveReport, dismissReport } from '@/app/actions/reports';
import { Loader2, CheckCircle2, XCircle, Trash2, ExternalLink, Flag, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ModerationDashboard() {
  const [activeTab, setActiveTab] = useState<'memes' | 'reports'>('memes');
  const [memes, setMemes] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingMemes, pendingReports] = await Promise.all([
        getPendingMemes(),
        getPendingReports()
      ]);
      setMemes(pendingMemes);
      setReports(pendingReports);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMeme = async (id: string) => {
    setProcessing(`approve-${id}`);
    try {
      await approveMeme(id);
      setMemes(memes.filter(m => m.id !== id));
      toast.success('Meme approved');
    } catch (e) {
      toast.error('Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectMeme = async (id: string) => {
    if (!confirm('Reject and delete this meme?')) return;
    setProcessing(`reject-${id}`);
    try {
      await rejectMeme(id);
      setMemes(memes.filter(m => m.id !== id));
      toast.success('Meme rejected');
    } catch (e) {
      toast.error('Rejection failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleResolveReport = async (id: number) => {
    setProcessing(`resolve-${id}`);
    try {
      await resolveReport(id);
      setReports(reports.filter(r => r.id !== id));
      toast.success('Report resolved');
    } catch (e) {
      toast.error('Resolution failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleDismissReport = async (id: number) => {
    setProcessing(`dismiss-${id}`);
    try {
      await dismissReport(id);
      setReports(reports.filter(r => r.id !== id));
      toast.success('Report dismissed');
    } catch (e) {
      toast.error('Dismiss failed');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">Moderation Queue</h2>
          <p className="text-white/40 text-sm">Review pending uploads and user reports.</p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('memes')}
            className={`flex-1 md:w-40 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'memes' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Pending Memes
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 md:w-40 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Reports
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
        </div>
      ) : activeTab === 'memes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.length === 0 ? (
            <div className="col-span-full py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-3xl">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-bold uppercase tracking-widest">No pending memes</p>
            </div>
          ) : (
            memes.map(meme => (
              <div key={meme.id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-48 w-full bg-black relative">
                  <img src={meme.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-white mb-1 line-clamp-1">{meme.title}</h3>
                  <p className="text-xs text-white/40 mb-4 line-clamp-2">{meme.description || 'No description'}</p>
                  
                  <div className="mt-auto pt-4 flex gap-2">
                    <button 
                      onClick={() => handleApproveMeme(meme.id)}
                      disabled={processing !== null}
                      className="flex-1 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      {processing === `approve-${meme.id}` ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
                    </button>
                    <button 
                      onClick={() => handleRejectMeme(meme.id)}
                      disabled={processing !== null}
                      className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      {processing === `reject-${meme.id}` ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-3xl">
              <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-bold uppercase tracking-widest">No pending reports</p>
            </div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-500/20">
                      {report.entityType}
                    </span>
                    <span className="text-white/40 text-xs font-medium">Reported by {report.reporter?.profile?.username || report.reporter?.name || 'User'}</span>
                  </div>
                  <p className="text-white font-medium mb-1">Reason: <span className="text-white/70 font-normal">{report.reason}</span></p>
                  
                  {report.entityType === 'tier_list' && (
                    <Link href={`/tier-list/${report.entityId}`} target="_blank" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-3">
                      View Content <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
                
                <div className="flex w-full md:w-auto gap-2">
                  <button 
                    onClick={() => handleResolveReport(report.id)}
                    disabled={processing !== null}
                    className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 hover:bg-white/90"
                  >
                    {processing === `resolve-${report.id}` ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Action Taken (Resolve)
                  </button>
                  <button 
                    onClick={() => handleDismissReport(report.id)}
                    disabled={processing !== null}
                    className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    {processing === `dismiss-${report.id}` ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
