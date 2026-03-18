import type { TriageItem } from '@/types/triage';

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const MOCK_DATA: TriageItem[] = [
  { id: '1', patient: 'Ana Beatriz Silva', category: 'Cirurgia', status: 'NOVO', lastMessage: minutesAgo(2), contactTime: minutesAgo(45) },
  { id: '2', patient: '(11) 98765-4321', category: 'Consulta', status: 'EM_ATENDIMENTO', responsible: 'Karla', lastMessage: minutesAgo(8), contactTime: minutesAgo(120) },
  { id: '3', patient: 'Marcos Oliveira', category: 'Pós-op', status: 'NOVO', lastMessage: minutesAgo(15), contactTime: minutesAgo(30) },
  { id: '4', patient: 'Clara Mendes', category: 'Lente de Contato', status: 'NOVO', lastMessage: minutesAgo(25), contactTime: minutesAgo(90) },
  { id: '5', patient: 'Roberto Costa', category: 'Olho Seco', status: 'FINALIZADO', responsible: 'Karla', lastMessage: minutesAgo(180), contactTime: minutesAgo(300) },
];
