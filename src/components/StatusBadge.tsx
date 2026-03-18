import type { Status } from '@/types/triage';

const statusStyles: Record<Status, string> = {
  NOVO: 'bg-status-novo text-status-novo-text border-status-novo-border',
  EM_ATENDIMENTO: 'bg-status-atendimento text-status-atendimento-text border-status-atendimento-border',
  FINALIZADO: 'bg-status-finalizado text-status-finalizado-text border-status-finalizado-border',
};

const statusLabels: Record<Status, string> = {
  NOVO: 'NOVO',
  EM_ATENDIMENTO: 'EM ATENDIMENTO',
  FINALIZADO: 'FINALIZADO',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider border ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
