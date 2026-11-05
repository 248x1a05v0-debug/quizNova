import React from 'react';
import {
  Compass,
  Atom,
  Calculator,
  Cpu,
  Hourglass,
  Trophy,
  Laptop,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Compass':
      return <Compass className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Hourglass':
      return <Hourglass className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
