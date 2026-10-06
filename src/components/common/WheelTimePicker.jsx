import React, { useRef, useEffect, useState } from 'react';

// Reusable single wheel component
const Wheel = ({ items, value, onChange, label }) => {
  const scrollRef = useRef(null);
  const itemHeight = 44; // Fixed height in px
  const [isScrolling, setIsScrolling] = useState(false);
  let scrollTimeout = useRef(null);

  // Sync scroll position when value changes externally
  useEffect(() => {
    if (!isScrolling && scrollRef.current) {
      const index = items.findIndex((item) => item.value === value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [value, items, isScrolling]);

  const handleScroll = (e) => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      const scrollTop = e.target.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      if (items[index] && items[index].value !== value) {
        onChange(items[index].value);
      }
      // Snap forcefully
      e.target.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="relative h-[132px] w-20 overflow-hidden flex flex-col items-center">
      {/* Selection Highlight (Center) */}
      <div className="absolute top-[44px] h-[44px] w-full bg-black/5 dark:bg-white/10 rounded-lg pointer-events-none" />
      
      {/* Scrollable container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar flex flex-col"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Top padding */}
        <div style={{ height: itemHeight, flexShrink: 0 }} />
        
        {items.map((item) => (
          <div 
            key={item.value} 
            onClick={() => {
              const index = items.findIndex((i) => i.value === item.value);
              if (index !== -1 && scrollRef.current) {
                scrollRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
                onChange(item.value);
              }
            }}
            className="snap-center flex items-center justify-center text-lg font-medium text-zinc-900 dark:text-zinc-100 transition-opacity cursor-pointer"
            style={{ height: itemHeight, flexShrink: 0, opacity: item.value === value ? 1 : 0.4 }}
          >
            {item.label}
          </div>
        ))}
        
        {/* Bottom padding */}
        <div style={{ height: itemHeight, flexShrink: 0 }} />
      </div>
    </div>
  );
};

export const WheelTimePicker = ({ value24h, onChange24h }) => {
  // Parse 24h to 12h
  const [h, m] = (value24h || '09:00').split(':').map(Number);
  const initialPeriod = h >= 12 ? 'PM' : 'AM';
  const initialHour12 = h % 12 === 0 ? 12 : h % 12;

  const [hour12, setHour12] = useState(initialHour12);
  const [minute, setMinute] = useState(m || 0);
  const [period, setPeriod] = useState(initialPeriod);

  // Update parent when any of the 3 changes
  useEffect(() => {
    let newH24 = period === 'PM' ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
    const newTime = `${newH24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    if (newTime !== value24h) {
      onChange24h(newTime);
    }
  }, [hour12, minute, period, onChange24h, value24h]);

  const hours = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }));
  const periods = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <Wheel items={hours} value={hour12} onChange={setHour12} />
      <span className="text-2xl font-light text-zinc-400 mb-1">:</span>
      <Wheel items={minutes} value={minute} onChange={setMinute} />
      <div className="w-4" /> {/* Spacer */}
      <Wheel items={periods} value={period} onChange={setPeriod} />
      
      {/* Hide scrollbar global style for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
