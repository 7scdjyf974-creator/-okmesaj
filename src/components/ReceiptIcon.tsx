import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { DeliveryStatus } from '../types/messaging';

interface ReceiptIconProps {
  status: DeliveryStatus;
  className?: string;
}

export const ReceiptIcon: React.FC<ReceiptIconProps> = ({ status, className = 'w-3.5 h-3.5' }) => {
  if (status === 'sending') {
    return <Clock className={`${className} text-[#8696A0] shrink-0`} aria-label="Gönderiliyor" />;
  }
  if (status === 'sent') {
    return <Check className={`${className} text-[#8696A0] shrink-0`} strokeWidth={2.2} aria-label="Gönderildi" />;
  }
  if (status === 'delivered') {
    return <CheckCheck className={`${className} text-[#8696A0] shrink-0`} strokeWidth={2.2} aria-label="İletildi" />;
  }
  return <CheckCheck className={`${className} text-[#53BDEB] shrink-0`} strokeWidth={2.2} aria-label="Okundu" />;
};
