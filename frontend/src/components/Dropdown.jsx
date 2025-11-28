import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';

const Dropdown = ({ title, items, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`dropdown-toggle ${isActive ? 'active' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path || '#'}
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              {item.icon && (
                <span className="dropdown-icon">
                  {item.icon}
                </span>
              )}
              <span className="dropdown-label">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

