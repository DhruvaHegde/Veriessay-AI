import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '0.8rem' },
    md: { padding: '10px 18px', fontSize: '0.875rem' },
    lg: { padding: '12px 24px', fontSize: '0.95rem' }
  };

  const styleClass = `btn btn-${variant} ${className}`;

  return (
    <button className={styleClass} style={sizeStyles[size]} {...props}>
      {icon && <span className="button-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
