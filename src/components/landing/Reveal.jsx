import { useEffect, useRef, useState } from 'react';

/**
 * Reveal: entrada de elementos al hacer scroll (IntersectionObserver).
 * Solo anima transform + opacity (GPU-safe). Respeta prefers-reduced-motion via CSS.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={`lp-reveal ${visible ? 'lp-in' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
