import React, { ReactNode, ChangeEvent } from 'react';

interface InputImageProps {
  children: ReactNode;
  className: string;
  name: string;
  id?: string;
  value?: string;
  callback: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputImage: React.FC<InputImageProps> = ({
  className,
  name,
  callback,
}) => {
  const onchange = (e: ChangeEvent<HTMLInputElement>) => {
    callback(e);
  };

  return (
    <input
    className={className}
    name={name}
    type="file"
    onChange={async (e: ChangeEvent<HTMLInputElement>) => {onchange(e) }}/>
  );
};
