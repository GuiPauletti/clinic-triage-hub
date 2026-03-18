import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, CheckCircle2, MoreHorizontal, User, Clock, MessageSquare, RefreshCw } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { WaitingTimeBadge } from '@/components/WaitingTimeBadge';
import { AssumeModal } from '@/components/AssumeModal';
import { MOCK_DATA } from '@/data/mockTriageData';
import type { TriageItem } from '@/types/triage';

const CATEGORIES = ['Consulta', 'Exames', 'Cirurgia', 'Pós-op', 'Lente de Contato', 'Olho Seco', 'Falar com Equipe'] as const;
const RESPONSAVEIS = ['Karla', 'Jodele'] as const;
const POLLING_INTERVAL = 15000; // 15 seconds

export default function TriageDashboard() {
  const [items, setItems] = useState<TriageItem[]>(MOCK_DATA);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterResponsible, setFilterResponsible] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/triage');
      // const data = await response.json();
      // setItems(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, []);

  // Auto-polling
  useEffect(() => {
    const interval = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const statusMatch = filterStatus === 'ALL' || item.status === filterStatus;
      const categoryMatch = filterCategory === 'ALL' || item.category === filterCategory;
      const responsibleMatch = filterResponsible === 'ALL' || item.responsible === filterResponsible;
      const searchMatch = !search || item.patient.toLowerCase().includes(search.toLowerCase());
      return statusMatch && categoryMatch && responsibleMatch && searchMatch;
    });
  }, [items, filterStatus, filterCategory, filterResponsible, search]);

  const handleAssume = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmAssume = (name: string) => {
    if (!selectedId) return;
    setItems(prev => prev.map(item =>
      item.id === selectedId
        ? { ...item, status: 'EM_ATENDIMENTO', responsible: name }
        : item
    ));
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleFinish = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'FINALIZADO' } : item
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Triagem WhatsApp</h1>
            <p className="text-muted-foreground text-sm">Clínica Oftalmológica — Painel de Controle</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="h-10 px-3 bg-card border border-border rounded-lg flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground shadow-sm transition-all"
              title="Atualizar agora"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline text-xs">Atualizar</span>
            </button>
            <div className="h-10 px-4 bg-card border border-border rounded-lg flex items-center gap-2 text-sm text-muted-foreground shadow-sm">
              <Clock size={16} />
              <span className="tabular-nums font-medium">
                {lastRefresh.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus}
            options={[
              { value: 'ALL', label: 'Todos os Status' },
              { value: 'NOVO', label: 'Novo' },
              { value: 'EM_ATENDIMENTO', label: 'Em Atendimento' },
              { value: 'FINALIZADO', label: 'Finalizado' },
            ]}
          />
          <FilterSelect label="Categoria" value={filterCategory} onChange={setFilterCategory}
            options={[
              { value: 'ALL', label: 'Todas as Categorias' },
              ...CATEGORIES.map(c => ({ value: c, label: c })),
            ]}
          />
          <FilterSelect label="Responsável" value={filterResponsible} onChange={setFilterResponsible}
            options={[
              { value: 'ALL', label: 'Todos' },
              ...RESPONSAVEIS.map(r => ({ value: r, label: r })),
            ]}
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Busca Rápida</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou telefone..."
                className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {['Paciente', 'Categoria', 'Status', 'Espera', 'Responsável', 'Última Msg', ''].map((h, i) => (
                    <th key={i} className={`px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground ${i === 6 ? 'text-right' : ''}`}>
                      {h || 'Ações'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredItems.map((item) => (
                  <motion.tr
                    layout
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors duration-150"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={14} />
                        </div>
                        <span className="font-medium text-foreground">{item.patient}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{item.category}</td>
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-4">
                      <WaitingTimeBadge contactTime={item.contactTime} status={item.status} />
                    </td>
                    <td className="px-5 py-4">
                      {item.responsible ? (
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item.responsible}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Aguardando</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {new Date(item.lastMessage).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {item.status !== 'FINALIZADO' && (
                          <>
                            <button onClick={() => handleAssume(item.id)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150" title="Assumir">
                              <UserPlus size={18} />
                            </button>
                            <button onClick={() => handleFinish(item.id)} className="p-2 text-muted-foreground hover:text-status-novo-text hover:bg-status-novo rounded-lg transition-all duration-150" title="Finalizar">
                              <CheckCircle2 size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-muted-foreground/50 hover:text-foreground rounded-lg transition-all duration-150">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <MessageSquare className="mx-auto text-border mb-4" size={48} />
              <p className="text-muted-foreground text-sm">Nenhum atendimento encontrado para estes filtros.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-right">
          Atualização automática a cada {POLLING_INTERVAL / 1000}s
        </p>
      </div>

      <AssumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmAssume} />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
