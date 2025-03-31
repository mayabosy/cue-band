/**
 * 
 * Font Size Button Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
// FontSizeButton functional component
const FontSizeButton = ({ currentTextSize, onTextSizeChange }) => {
    const fontSizes = ['small', 'medium', 'large']; // Available font sizes

    return (
        <div>
            {fontSizes.map((size) => (
                <button
                    key={size}
                    onClick={() => onTextSizeChange(size)}
                    style={{ margin: '0 4px', backgroundColor: currentTextSize === size ? '#007BFF' : '#f0f0f0', color: currentTextSize === size ? 'white' : 'black' }}
                    aria-pressed={currentTextSize === size}
                >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default FontSizeButton;
