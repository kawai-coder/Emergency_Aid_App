import { ReactNode, CSSProperties } from 'react';
import { classNames } from '@/lib/utils/classNames';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export function SectionCard({ children, className, delay = 0, style }: SectionCardProps) {
  const delayClass = delay > 0 ? `animation-delay-[${delay}ms]` : '';
  
  return (
    <div 
      className={classNames(
        'rounded-3xl bg-white p-6 shadow-apple-sm border border-apple-border/50',
        'transition-all duration-300 ease-apple',
        'hover:shadow-apple-xl hover:-translate-y-1',
        'active:scale-[0.99] active:duration-150',
        delayClass,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
