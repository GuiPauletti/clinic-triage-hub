import type { TriageItem } from '@/types/triage';

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const MOCK_DATA: TriageItem[] = [
  { id: '1', patient: 'Ana Beatriz Silva', category: 'Cirurgia', status: 'NOVO', lastMessage: minutesAgo(2), contactTime: minutesAgo(45), tempo_total_contato: '0:45' },
  { id: '2', patient: '(11) 98765-4321', category: 'Consulta', status: 'EM_ATENDIMENTO', responsible: 'Karla', lastMessage: minutesAgo(8), contactTime: minutesAgo(120), tempo_sem_resposta: '0:25', tempo_total_contato: '2:00' },
  { id: '3', patient: 'Marcos Oliveira', category: 'Pós-op', status: 'NOVO', lastMessage: minutesAgo(15), contactTime: minutesAgo(30), tempo_total_contato: '0:30' },
  { id: '4', patient: 'Clara Mendes', category: 'Lente de Contato', status: 'EM_ATENDIMENTO', responsible: 'Jodele', lastMessage: minutesAgo(25), contactTime: minutesAgo(90), tempo_sem_resposta: '1:05', tempo_total_contato: '1:30' },
  { id: '5', patient: 'Roberto Costa', category: 'Olho Seco', status: 'FINALIZADO', responsible: 'Karla', lastMessage: minutesAgo(180), contactTime: minutesAgo(300), tempo_total_contato: '2:15', data_finalizacao: minutesAgo(60) },
];
