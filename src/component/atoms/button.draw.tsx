import React, { ReactNode } from 'react';

interface ButtonDrawProps {
  children: ReactNode;
  className?: string;
  callback: () => void;
}

export const ButtonDraw: React.FC<ButtonDrawProps> = ({ children, className = '', callback }) => {
  const onEvent = () => {
    callback();
  };

  return (
    <button onClick={onEvent} className={className}>
      {children}
    </button>
  );
};
