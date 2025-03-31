/**
 * 
 * With Accessibility Styles Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';

const withAccessibilityStyles = (WrappedComponent) => {
  return (props) => {
    const { accessibilityOptions = {}, style: componentStyle } = props;

    const { textSize = 'small' } = accessibilityOptions;

    const computedStyles = {
      fontSize: (() => {
        switch (textSize) {
          case 'small':
            return '1.2em'; 
          case 'medium':
            return '1.4em';
          case 'large':
            return '1.6em';
          default:
            return '1.2em'; // 
        }
      })(),
      ...componentStyle
    };

    return <WrappedComponent {...props} style={computedStyles} />;
  };
};

export default withAccessibilityStyles;
