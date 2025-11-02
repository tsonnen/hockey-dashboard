import React from 'react';

export function Multiselect({
  options,
  label,
  selected,
  onApply,
}: {
  options: Array<{ key: string; label: string }>;
  label: string;
  selected: Array<string>;
  onApply: (selected: Array<string>) => void;
}): React.JSX.Element {
  const getOptionSelected = (option: string) => {
    return internalSelected.includes(option);
  };

  const handleOptionChange = (key: string) => {
    if (internalSelected.includes(key)) {
      setInternalSelected(internalSelected.filter((item) => item !== key));
    } else {
      setInternalSelected([...internalSelected, key]);
    }
  };

  const handleApply = () => {
    onApply(internalSelected);
    setIsOpen(false);
  };

  const selectAll = () => {
    const allOptions = options.map((option) => option.key);
    setInternalSelected(allOptions);
  };

  const deselectAll = () => {
    setInternalSelected([]);
  };

  const [internalSelected, setInternalSelected] = React.useState<Array<string>>(selected);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInternalSelected(selected);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, JSON.stringify(selected)]); // selected is an array, so we stringify it to avoid unnecessary re-renders

  return (
    <div>
      <div>
        <div className="dropdown relative inline-block text-left" ref={dropdownRef}>
          <span className="rounded-md shadow-sm">
            <button
              className="inline-flex rounded-md border bg-white px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none dark:bg-gray-800"
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span>{label}</span>
              <svg className="-mr-1 ml-2 size-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </span>
          <div className={`dropdown-menu${isOpen ? '' : ' hidden'}`}>
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y rounded-md  border bg-white shadow-lg outline-none dark:bg-gray-900">
              <div className="mb-2 flex gap-2 border">
                <button
                  className="flex-1 place-items-center py-1 hover:bg-blue-500 dark:hover:bg-gray-800"
                  onClick={selectAll}
                >
                  Select All
                </button>
                <span className="border-l border-gray-300 dark:border-gray-700"></span>
                <button
                  className="flex-1 place-items-center py-1 hover:bg-blue-500 dark:hover:bg-gray-800"
                  onClick={deselectAll}
                >
                  Deselect All
                </button>
              </div>
              {options.map((option) => (
                <div
                  key={option.key}
                  className="border-none ps-4 hover:bg-blue-500 dark:hover:bg-gray-800"
                >
                  <label className="w-full">
                    <input
                      type="checkbox"
                      checked={getOptionSelected(option.key)}
                      className="me-2 mt-2 dark:accent-gray-600"
                      onChange={() => handleOptionChange(option.key)}
                    />
                    {option.label}
                  </label>
                </div>
              ))}
              <button
                className="w-full place-items-center ps-2 hover:bg-blue-500 dark:hover:bg-gray-800"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
