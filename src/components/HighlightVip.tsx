import React from 'react';

export const HighlightVip = ({ text, className = '' }: { text: string; className?: string }) => {
  const parts = text.split(/(?<!\p{L})(VIP|ВІП|ВИП)(?!\p{L})/iu);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (/^(VIP|ВІП|ВИП)$/i.test(part)) {
          return (
            <span key={index} className="text-primary font-bold">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

