/**
 * 
 * Accessibility Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import FontSizeButton from './FontSizeButton';

// AccessibilityToggle functional component
const AccessibilityToggle = ({
    accessibilityOptions,
    onTextSizeChange,
}) => {
    // Rendering accessibility options
    return (
        <div>
            <div>
                <FontSizeButton textSize={accessibilityOptions.textSize} onTextSizeChange={() => onTextSizeChange()} />
            </div>
        </div>
    );
};

export default AccessibilityToggle;