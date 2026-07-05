import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      variant?: ButtonVariant;
      href?: string;
    }
>;

export function Button({ variant = 'primary', href, className = '', children, ...props }: ButtonProps) {
  const classes = `lifeos-button${variant === 'secondary' ? ' lifeos-button--secondary' : ''}${
    className ? ` ${className}` : ''
  }`;

  if (href) {
    return (
      <a className={classes} href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
