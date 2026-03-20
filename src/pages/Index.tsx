import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, CheckCircle2, User, Clock, MessageSquare, RefreshCw, LogOut } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { WaitingTimeBadge } from '@/components/WaitingTimeBadge';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ForwardButton } from '@/components/ForwardButton';
import { ObservationCell } from '@/components/ObservationCell';
import { AssumeModal } from '@/components/AssumeModal';
import { useAuth } from '@/contexts/AuthContext';
import { TriageFilters } from '@/components/TriageFilters';
import type { TriageItem, Status, Category } from '@/types/triage';

const POLLING_INTERVAL = 30000;

function parseTimeToMinutes(time?: string): number {
  if (!time) return 0;
  const parts = time.split(':');
  if (parts.length !== 2) return 0;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function sortItems(items: TriageItem[]): TriageItem[] {
  const statusOrder: Record<Status, number> = { EM_ATENDIMENTO: 0, NOVO: 1, FINALIZADO: 2 };
  return [...items].sort((a, b) => {
    const orderA = statusOrder[a.status] ?? 99;
    const orderB = statusOrder[b.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    if (a.status === 'EM_ATENDIMENTO' && b.status === 'EM_ATENDIMENTO') {
      return parseTimeToMinutes(b.tempo_sem_resposta) - parseTimeToMinutes(a.tempo_sem_resposta);
    }
    if (a.status === 'NOVO' && b.status === 'NOVO') {
      return new Date(a.contactTime).getTime() - new Date(b.contactTime).getTime();
    }
    return 0;
  });
}


function parseContactTime(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  // Already ISO format
  if (dateStr.includes('T')) return dateStr;
  // DD-MM-YYYY HH:mm
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/);
  if (match) {
    const [, dd, mm, yyyy, hh, min] = match;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min)).toISOString();
  }
  return new Date().toISOString();
}
export default function TriageDashboard() {
  const { currentUser, logout } = useAuth();
  const [items, setItems] = useState<TriageItem[]>([]);
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
      const res = await fetch(
        'https://consultoriooftalmogui.app.n8n.cloud/webhook/triagem/list?key=Gui@oftalmoSul2026'
      );
      if (!res.ok) throw new Error('Erro ao buscar dados');
      const data: any[] = await res.json();
      const mapped: TriageItem[] = data
        .filter((item: any) => item.id)
        .map((item: any) => ({
          id: item.id,
          phone: String(item.phone || ''),
          patient: item.name || '',
          category: (item.categoria as Category) || ('Sem Categoria' as Category),
          status: (item.status as Status) || 'NOVO',
          responsible: item.assumido_por || item.responsavel || undefined,
          lastMessage: item.mensagem_paciente || '',
          contactTime: parseContactTime(item.data_hora),
          observacao: item.observacao_interna || '',
        }));
      setItems(mapped);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter(item => {
      const statusMatch = filterStatus === 'ALL' || item.status === filterStatus;
      const categoryMatch = filterCategory === 'ALL' || item.category === filterCategory;
      const responsibleMatch = filterResponsible === 'ALL' || item.responsible === filterResponsible;
      const searchMatch = !search || item.patient.toLowerCase().includes(search.toLowerCase());
      return statusMatch && categoryMatch && responsibleMatch && searchMatch;
    });
    return sortItems(filtered);
  }, [items, filterStatus, filterCategory, filterResponsible, search]);

  const handleAssume = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmAssume = (name: string) => {
    if (!selectedId) return;
    setItems(prev => prev.map(item =>
      item.id === selectedId ? { ...item, status: 'EM_ATENDIMENTO', responsible: name } : item
    ));
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleFinish = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'FINALIZADO', data_finalizacao: new Date().toISOString() } : item
    ));
  };

  const handleForward = (id: string, responsavel: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, responsible: responsavel } : item
    ));
  };

  const formatFinalizacao = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} ${hh}:${min}`;
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
            <button
              onClick={logout}
              className="h-10 px-3 bg-card border border-border rounded-lg flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground shadow-sm transition-all"
              title="Sair"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline text-xs">{currentUser}</span>
            </button>
          </div>
        </header>

        <TriageFilters
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          filterResponsible={filterResponsible} setFilterResponsible={setFilterResponsible}
          search={search} setSearch={setSearch}
        />

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {['Paciente', 'Categoria', 'Status', 'Responsável', 'Espera', 'Sem Resposta', 'Duração Total', 'Observações', 'Ações'].map((h, i) => (
                    <th key={i} className={`px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground ${i === 8 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredItems.map((item) => (
                  <motion.tr layout key={item.id} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User size={14} />
                        </div>
                        <span className="font-medium text-foreground">{item.patient}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={item.status} />
                        {item.status === 'FINALIZADO' && item.data_finalizacao && (
                          <span className="text-[10px] text-muted-foreground">{formatFinalizacao(item.data_finalizacao)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.responsible ? (
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item.responsible}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Aguardando</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'NOVO' ? (
                        <WaitingTimeBadge contactTime={item.contactTime} status={item.status} />
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'EM_ATENDIMENTO' && item.tempo_sem_resposta ? (
                        <span className="text-sm font-semibold text-destructive tabular-nums">{item.tempo_sem_resposta}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.tempo_total_contato ? (
                        <span className="text-sm tabular-nums text-muted-foreground">{item.tempo_total_contato}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ObservationCell itemId={item.id} initialValue={item.observacao} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center gap-1 flex-wrap">
                        <ForwardButton
                          itemId={item.id}
                          onSuccess={(r) => handleForward(item.id, r)}
                        />
                        <WhatsAppButton phone={item.phone} />
                        {item.status !== 'FINALIZADO' && (
                          <button
                            onClick={() => handleFinish(item.id)}
                            className="p-2 text-muted-foreground hover:text-status-novo-text hover:bg-status-novo rounded-lg transition-all duration-150"
                            title="Finalizar"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
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
