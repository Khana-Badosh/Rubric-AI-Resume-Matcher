import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'btn-primary',
  success: 'btn-primary',
  light: 'btn-primary',
  outline: 'btn-ghost',
  inactive: 'btn-primary',
};

const SIZES = {
  sm: 'btn-small',
  md: 'btn-small',
  lg: '',
};

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'lg',
  block = false,
  className = '',
  children,
  ...props
}) {
  const classes = ['btn', VARIANTS[variant], SIZES[size], block && 'btn-block', className]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
