import { Search } from 'lucide-react';

const CATEGORIES = ['Consulta', 'Exames', 'Cirurgia', 'Pós-op', 'Lente de Contato', 'Olho Seco', 'Falar com Equipe', 'Sem Categoria'] as const;
const RESPONSAVEIS = ['Dr Guilherme', 'Karla', 'Jodele', 'Carlise', 'Rafael'] as const;

interface TriageFiltersProps {
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterResponsible: string;
  setFilterResponsible: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export function TriageFilters({
  filterStatus, setFilterStatus,
  filterCategory, setFilterCategory,
  filterResponsible, setFilterResponsible,
  search, setSearch,
}: TriageFiltersProps) {
  return (
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
