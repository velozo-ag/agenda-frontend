import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook to enable agile horizontal scrolling with a desktop mouse:
 * 1. Wheel-to-Horizontal: Vertical mouse wheel turns into smooth horizontal scroll.
 * 2. Drag-to-Scroll: Mouse click & drag to pan left/right.
 * 3. Step buttons: scrollLeft / scrollRight helpers.
 */
export function useHorizontalScroll({ enableDrag = true, speed = 1 } = {}) {
  const containerRef = useRef(null);

  // Wheel listener: Converts vertical mouse wheel to horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // If there is vertical scroll delta and the container is horizontally scrollable
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * speed;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [speed]);

  // Drag-to-scroll listener (optional smooth click & drag)
  useEffect(() => {
    if (!enableDrag) return;
    const el = containerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    const handleMouseDown = (e) => {
      // Only primary mouse button (left click)
      if (e.button !== 0) return;
      isDown = true;
      isDragging = false;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) {
        isDragging = true;
        el.scrollLeft = scrollLeft - walk;
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Prevent accidental clicks on buttons if user was dragging
        const captureClick = (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
        };
        window.addEventListener('click', captureClick, { capture: true, once: true });
      }
      isDown = false;
      isDragging = false;
    };

    const handleMouseLeave = () => {
      isDown = false;
      isDragging = false;
    };

    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableDrag]);

  const scrollToLeft = useCallback((offset = 240) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -offset, behavior: 'smooth' });
    }
  }, []);

  const scrollToRight = useCallback((offset = 240) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  return { containerRef, scrollToLeft, scrollToRight };
}
