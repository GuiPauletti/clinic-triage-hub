import { Timer } from 'lucide-react';
import { useWaitingTime } from '@/hooks/useWaitingTime';

interface WaitingTimeBadgeProps {
  contactTime: string;
  status: string;
}

export function WaitingTimeBadge({ contactTime, status }: WaitingTimeBadgeProps) {
  const waitingTime = useWaitingTime(contactTime);

  const diffMs = Date.now() - new Date(contactTime).getTime();
  const totalMinutes = Math.floor(diffMs / 60000);

  const isUrgent = totalMinutes >= 60 && status !== 'FINALIZADO';
  const isWarning = totalMinutes >= 30 && totalMinutes < 60 && status !== 'FINALIZADO';

  return (
    <div className={`flex items-center gap-1.5 text-sm tabular-nums ${
      isUrgent ? 'text-destructive font-semibold' :
      isWarning ? 'text-status-atendimento-text font-medium' :
      'text-muted-foreground'
    }`}>
      <Timer size={14} className={isUrgent ? 'animate-pulse' : ''} />
      <span>{waitingTime}</span>
    </div>
  );
}
