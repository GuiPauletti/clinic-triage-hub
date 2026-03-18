export type Status = 'NOVO' | 'EM_ATENDIMENTO' | 'FINALIZADO';
export type Category = 'Consulta' | 'Exames' | 'Cirurgia' | 'Pós-op' | 'Lente de Contato' | 'Olho Seco' | 'Falar com Equipe';

export interface TriageItem {
  id: string;
  patient: string;
  category: Category;
  status: Status;
  responsible?: string;
  lastMessage: string;
  contactTime: string; // ISO timestamp when patient first contacted
  tempo_sem_resposta?: string; // e.g. "0:15" or "1:30" — time since last responsible message
  tempo_total_contato?: string; // e.g. "0:45" or "2:10" — total contact duration
  data_finalizacao?: string; // ISO timestamp when finalized
}
