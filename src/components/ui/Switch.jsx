import React from 'react';

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  label = '',
  description = '',
  id,
  className = ''
}) {
  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-amber-500 dark:bg-amber-400' : 'bg-zinc-300 dark:bg-zinc-800 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-700'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-zinc-500 font-mono">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
