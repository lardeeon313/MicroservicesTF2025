import { useState, useRef, useEffect } from 'react';

// Hook para cerrar al hacer click afuera
const useClickOutside = (handler: () => void) => {
  const domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (domNode.current && !domNode.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [handler]);

  return domNode;
};

// Props genéricas
type Option<T> = {
  label: string;
  value: T;
};

type GenericDropdownProps<T> = {
  options: Option<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
  selected?: T;
  disabled?: boolean;
  buttonClassName?: string;
  dropdownClassName?: string;
};

const GenericDropdown = <T,>({
  options,
  placeholder = "Seleccionar...",
  onChange,
  selected,
  disabled = false,
  buttonClassName = '',
  dropdownClassName = '',
}: GenericDropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const domNode = useClickOutside(() => setOpen(false));

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label ?? placeholder;

  return (
    <div ref={domNode} className="relative inline-block w-full text-left">
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex w-full justify-between rounded border border-gray-300 px-4 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none ${buttonClassName}`}
        disabled={disabled}
      >
        {selectedLabel}
        <svg
          className="ml-2 h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12l-5-5h10l-5 5z" />
        </svg>
      </button>

      <div
        className={`absolute z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        } ${dropdownClassName}`}
      >
        <ul className="py-1">
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenericDropdown;
