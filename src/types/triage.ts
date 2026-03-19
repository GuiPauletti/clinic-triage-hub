export type Status = 'NOVO' | 'EM_ATENDIMENTO' | 'FINALIZADO';

export type Category =
  | 'Consulta'
  | 'Exames'
  | 'Cirurgia'
  | 'Pós-op'
  | 'Lente de Contato'
  | 'Olho Seco'
  | 'Falar com Equipe';

export interface TriageItem {
  id: string;
  phone?: string;
  patient: string;
  category: Category;
  status: Status;
  responsible?: string;
  lastMessage: string;
  contactTime: string;
  tempo_sem_resposta?: string;
  tempo_total_contato?: string;
  data_finalizacao?: string;
  observacao?: string;
}
