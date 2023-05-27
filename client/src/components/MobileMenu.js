import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const MobileMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="mobile-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      {isMenuOpen && (
        <ul className="menu-items">
          <li onClick={handleMenuItemClick} >
            <Link to="/allrecords">
              <i className="ph-browsers"></i>
              <span>All Records</span>
            </Link>
          </li>
          <li onClick={handleMenuItemClick}>
            <Link to="/addrecord">
              <i className="ph-check-square"></i>
              <span>Add Record</span>
            </Link>
          </li>
          <li onClick={handleMenuItemClick}>
            <Link to="/csv">
              <i className="ph-check-square"></i>
              <span>CSV</span>
            </Link>
          </li>
          <li onClick={handleMenuItemClick}>
            <Link to="/search">
              <i className="ph-check-square"></i>
              <span>Search</span>
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default MobileMenu;
