import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AssumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function AssumeModal({ isOpen, onClose, onConfirm }: AssumeModalProps) {
  const [name, setName] = useState('');

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleClose}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-8"
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Assumir Atendimento</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Insira o nome do responsável que cuidará deste paciente no WhatsApp.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Nome do Responsável
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  placeholder="Ex: Karla ou Jodele"
                  className="w-full h-12 px-4 bg-muted border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 h-11 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!name.trim()}
                  className="flex-1 h-11 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
