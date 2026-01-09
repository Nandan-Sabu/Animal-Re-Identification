import React from 'react'
import { useState, createContext, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  PanelRight,
  House,
  Book,
  Upload,
  Images,
  ScanSearch,
  ScanEye,
  CircleAlert,
  Settings
} from 'lucide-react';
import './navbar.css';

const NavbarContext = createContext({ expanded: true });

function NavbarItem({ icon, text, to }) {
  const { expanded } = useContext(NavbarContext);
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `navbar__item ${isActive ? 'navbar__item--active' : ''}`
      }
    >
      <div className="navbar__item-icon">{icon}</div>
      <span
        className={`navbar__item-text ${
          expanded ? 'navbar__item-text--expanded' : 'navbar__item-text--collapsed'
        }`}
      >
        {text}
      </span>
    </NavLink>
  );
}
export default function Navbar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <NavbarContext.Provider value={{ expanded }}>
      <nav className={`navbar ${expanded ? 'navbar--expanded' : 'navbar--collapsed'}`}>
        {/* Top Section */}
        <button className="navbar__toggle" onClick={() => setExpanded(prev => !prev)}>
          <span
            className={`navbar__title ${
              expanded ? 'navbar__title--expanded' : 'navbar__title--collapsed'
            }`}
          >
            CARE
          </span>
          <PanelRight />
        </button>
        <div className="navbar__spacer navbar__spacer--top" />
        {/* Middle Section */}
        <div className="navbar__links">
          <div
            className={`navbar__divider ${
              expanded ? 'navbar__divider--expanded' : 'navbar__divider--collapsed'
            }`}
          />
          <NavbarItem icon={<House />} text="Home" to="/" />
          <NavbarItem icon={<CircleAlert />} text="About" to="/about" />
          <NavbarItem icon={<Book />} text="User Guide" to="/user-guide" />
          <div
            className={`navbar__divider ${
              expanded ? 'navbar__divider--expanded' : 'navbar__divider--collapsed'
            }`}
          />
          <NavbarItem icon={<Upload />} text="Upload Files" to="/upload" />
          <NavbarItem icon={<Images />} text="Gallery View" to="/uploads" />
          <NavbarItem icon={<ScanSearch />} text="Detect Result" to="/images" />
          <NavbarItem icon={<ScanEye />} text="ReID Result" to="/reid" />
          <div
            className={`navbar__divider ${
              expanded ? 'navbar__divider--expanded' : 'navbar__divider--collapsed'
            }`}
          />
        </div>
        <div className="navbar__spacer navbar__spacer--bottom" />
        {/* Bottom Section */}
        <NavbarItem icon={<Settings />} text="Settings" to="/settings" />
      </nav>
    </NavbarContext.Provider>
  );
}