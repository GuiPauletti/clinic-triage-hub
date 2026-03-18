import type { TriageItem } from '@/types/triage';

export const MOCK_DATA: TriageItem[] = [
  { id: '1', patient: 'Ana Beatriz Silva', category: 'Cirurgia', status: 'NOVO', lastMessage: '2023-10-27T10:30:00' },
  { id: '2', patient: '(11) 98765-4321', category: 'Consulta', status: 'EM_ATENDIMENTO', responsible: 'Karla', lastMessage: '2023-10-27T10:15:00' },
  { id: '3', patient: 'Marcos Oliveira', category: 'Pós-op', status: 'HUMANO', responsible: 'Jodele', lastMessage: '2023-10-27T09:45:00' },
  { id: '4', patient: 'Clara Mendes', category: 'Lente de Contato', status: 'NOVO', lastMessage: '2023-10-27T09:00:00' },
  { id: '5', patient: 'Roberto Costa', category: 'Olho Seco', status: 'FINALIZADO', responsible: 'Karla', lastMessage: '2023-10-26T16:20:00' },
];
