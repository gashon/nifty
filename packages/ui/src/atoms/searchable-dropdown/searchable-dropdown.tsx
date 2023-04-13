import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  title: string;
}

interface SearchableDropdownProps {
  items: DropdownItem[];
  onItemSelect: (item: DropdownItem) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  onItemSelect,
}) => {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, items]);

  const handleItemClick = (item: DropdownItem) => {
    setSearch(item.title);
    setIsDropdownVisible(false);
    setFilteredItems([]);
    onItemSelect(item);
  };

  const handleInputClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchable-dropdown">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClick={handleInputClick}
        autoComplete="off"
        className="text-black"
      />
      {isDropdownVisible && (
        <ul ref={dropdownRef} className="dropdown-list">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="dropdown-item text-black cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
