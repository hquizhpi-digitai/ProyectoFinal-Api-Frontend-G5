import { CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export default function SuccessMessage({ message, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800',
        className
      )}
    >
      <CheckCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

