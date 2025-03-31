/**
 * 
 * Footer Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import withAccessibilityStyles from './withAccessibilityStyles';

function Footer({ accessibilityOptions, style }) {
  return (
    <footer role="contentinfo">
      {/* Help, FAQ, Contact Bar */}
      <nav aria-label="Help, FAQ, and Contact" className="custom-bg-color py-10 text-center shadow-inner navbar-footer" style={{ fontFamily: 'DM Serif Text", serif', ...style }} role="navigation">
        <ul className="flex justify-center" role="list">
          <li role="listitem">
            <a href="/contact" className="mx-10 font-bold text-white hover:text-yellow-400">Contact</a>
          </li>
          <li role="listitem">
            <a href="https://faq.cue.band/" className="mx-10 font-bold text-white hover:text-yellow-400">FAQ</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default withAccessibilityStyles(Footer); 
