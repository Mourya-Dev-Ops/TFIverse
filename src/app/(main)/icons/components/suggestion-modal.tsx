'use client';

import { useState } from 'react';
import { submitSuggestion } from '@/app/actions/moderation';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: 'people' | 'movie';
    entityId: string;
    currentData: any;
    entityName: string;
}

export default function SuggestionModal({ 
    isOpen, 
    onClose, 
    entityType, 
    entityId, 
    currentData,
    entityName 
}: SuggestionModalProps) {
    const [formData, setFormData] = useState(currentData);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await submitSuggestion({
            entityType,
            entityId,
            suggestionData: formData,
            reason
        });

        setIsSubmitting(false);
        if (res.success) {
            toast.success('Thank you! Your suggestion has been submitted for review.');
            onClose();
        } else {
            toast.error(res.error || 'Something went wrong');
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white">Suggest an Edit</h3>
                                <p className="text-zinc-400 text-sm">Editing: {entityName}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                <p className="text-sm text-blue-200">
                                    Changes will be reviewed by our moderation team before going live. Please provide accurate information.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name || ''} 
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                    />
                                </div>

                                {entityType === 'people' && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Birth Date (YYYY-MM-DD)</label>
                                        <input 
                                            type="date" 
                                            value={formData.metadata?.birth_date || ''} 
                                            onChange={(e) => handleFieldChange('metadata', { ...formData.metadata, birth_date: e.target.value })}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Reason for change</label>
                                    <textarea 
                                        rows={3}
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="e.g., Updated birth date from official source"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </form>

                        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                            >
                                {isSubmitting ? 'Submitting...' : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Submit for Review
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
