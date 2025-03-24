import React, { useState, useEffect, useRef } from 'react';

interface CustomDropdownProps {
  options: string[];
  onSelect: (value: string, text: string) => void;
  selectedText?: string;
  label: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  onSelect, 
  selectedText = '', 
  label 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{
      position: 'relative',
      width: '100%',
      maxWidth: '500px',
      zIndex: 1000000,
      marginBottom: '10px'
    }}>
      <label style={{
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: 400
      }}>
        {label}
      </label>
      
      <button type="button" style={{
        width: '100%',
        height: '34px',
        padding: '0 10px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '2px',
        fontSize: '14px',
        color: selectedText ? '#333' : '#999',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedText || 'Select option'}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <ul style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '2px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        //   zIndex: 9999999,
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {options.map((option, index) => (
            <li
              key={index}
              style={{
                padding: '10px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                color: '#999',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'black';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#999';
              }}
              onClick={() => {
                onSelect(`option_${index}`, option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;