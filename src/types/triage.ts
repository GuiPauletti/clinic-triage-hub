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
}
