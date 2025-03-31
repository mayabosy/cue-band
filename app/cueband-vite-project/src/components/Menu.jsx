/**
 * 
 * Menu Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import withAccessibilityStyles from './withAccessibilityStyles';
import CueBandLogo2 from '../assets/logo2.png';

// Functional component for Menu
function Menu({ accessibilityOptions, style, signedIn }) {
  // State variables
  const [isActive, setIsActive] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  // Effect hook to update active link based on location change
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Function to toggle active class for menu
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  return (
    <header className="App-header shadow-lg">
      <nav className="navbar custom-bg-color" style={{ fontFamily: 'DM Serif Text", serif', ...style }}>
        <div className="logo">
          <Link to="/aboutus">
            <img src={CueBandLogo2} alt="Cue Band Logo" className="logo-image" style={{ width: '120px', height: 'auto' }} />
          </Link>
        </div>
        <ul className={`navMenu ${isActive ? 'active' : ''}`} role="menubar">
          <li role="menuitem" onClick={() => setIsActive(false)}>
            {signedIn && (<Link
              to="/band"
              className={`navLink ${activeLink === "/band" || activeLink.startsWith("/band/") ? 'active' : ''}`}
              style={{ ...style, padding: '15px', fontSize: '1.2em' }}
            >
              My Band
            </Link>)}
          </li>

          <li role="menuitem" onClick={() => setIsActive(false)}>
            {signedIn && (<Link
              to="/schedule"
              className={`navLink ${activeLink === "/schedule" || activeLink.startsWith("/schedule/") ? 'active' : ''}`}
              style={{ ...style, padding: '15px', fontSize: '1.2em' }}
            >
              Cueing
            </Link>)}
          </li>
          <li role="menuitem" onClick={() => setIsActive(false)}>
            {signedIn && (<Link
              to="/journal"
              className={`navLink ${activeLink === "/journal" ? 'active' : ''}`}
              style={{ ...style, padding: '15px', fontSize: '1.2em' }}
            >
              Journal
            </Link>)}
          </li>

          <li role="menuitem" onClick={() => setIsActive(false)}>
            <Link
              to="/aboutus"
              className={`navLink ${activeLink === "/home" ? 'active' : ''}`}
              style={{ ...style, padding: '15px', fontSize: '1.2em' }}
            >
              About Us
            </Link>
          </li>

        </ul>
        <div
          className={`hamburger ${isActive ? 'active' : ''}`}
          onClick={toggleActiveClass}
          aria-label="Toggle Navigation Menu"
          role="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>
    </header>
  );
}

export default withAccessibilityStyles(Menu);
