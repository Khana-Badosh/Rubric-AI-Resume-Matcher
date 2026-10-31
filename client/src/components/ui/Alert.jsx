export default function Alert({ children, className = '', ...props }) {
  if (!children) return null;

  return (
    <div role="alert" className={`notice ${className}`} {...props}>
      {children}
    </div>
  );
}
