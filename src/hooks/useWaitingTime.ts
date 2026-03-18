import { useState, useEffect } from 'react';

export function useWaitingTime(contactTime: string): string {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const diffMs = now - new Date(contactTime).getTime();
  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 1) return 'agora';
  if (totalMinutes < 60) return `${totalMinutes}min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

export function formatWaitingTime(contactTime: string): string {
  const diffMs = Date.now() - new Date(contactTime).getTime();
  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 1) return 'agora';
  if (totalMinutes < 60) return `${totalMinutes}min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}
