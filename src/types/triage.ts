export type Status = 'NOVO' | 'EM_ATENDIMENTO' | 'HUMANO' | 'FINALIZADO';
export type Category = 'Consulta' | 'Exames' | 'Cirurgia' | 'Pós-op' | 'Lente de Contato' | 'Olho Seco' | 'Falar com Equipe';

export interface TriageItem {
  id: string;
  patient: string;
  category: Category;
  status: Status;
  responsible?: string;
  lastMessage: string;
}
