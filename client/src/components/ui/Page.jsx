export default function Page({ width = 'max-w-3xl', center = false, className = '', children }) {
  return (
    <main id="main" className={`page container ${center ? 'flex items-center justify-center' : ''}`}>
      <div className={`${center ? 'w-full' : 'mx-auto'} ${width} ${className}`}>{children}</div>
    </main>
  );
}
