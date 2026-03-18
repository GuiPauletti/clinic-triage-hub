interface WhatsAppButtonProps {
  phone: string;
}

const formatPhone = (phone: string): string => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.startsWith('55') ? digits : '55' + digits;
};

export const WhatsAppButton = ({ phone }: WhatsAppButtonProps) => {
  if (!phone) return null;
  const formattedPhone = formatPhone(phone);
  return (
    <a
      href={`https://wa.me/${formattedPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
      title={`Abrir WhatsApp: +${formattedPhone}`}
    >
      💬
    </a>
  );
};
