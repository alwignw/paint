import React, { ReactNode, ChangeEvent } from 'react';

interface InputColorProps {
  children: ReactNode;
  className: string;
  name: string;
  id: string;
  value: string;
  callback: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputColor: React.FC<InputColorProps> = ({
  children,
  className,
  name,
  id,
  value,
  callback,
}) => {
  const onchange = (e: ChangeEvent<HTMLInputElement>) => {
    callback(e);
  };

  return (
    <button className={className}>
      <label htmlFor={id}>{children}</label>
      <input
        style={{
          width: '50px',
          height: '20px',
        }}
        name={name}
        type="color"
        value={value}
        onChange={(e) => onchange(e)}
      />
    </button>
  );
};
