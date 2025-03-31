/**
 * 
 * Accessibility Optionws Window Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useEffect, useState } from 'react';

function AccessibilityOptionsWindow({ isOpen, onClose, accessibilityOptions, onTextSizeChange }) {
    const [currentTextSize, setCurrentTextSize] = useState(accessibilityOptions.textSize || 'small');

    // Set the current text size when accessibility options change
    useEffect(() => {
        setCurrentTextSize(accessibilityOptions.textSize || 'small');
    }, [accessibilityOptions]);

    return (
        <div className={`accessibility-options-window-container ${isOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true" aria-labelledby="accessibility-options-heading">
            <div className="accessibility-options-window" role="document">
                {/* Font size options */}
                <div>
                    <h2 id="accessibility-options-heading" className="sr-only">Accessibility Options</h2>
                    <span className="text-lg font-semibold">Font size:</span>
                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            onClick={() => {
                                
                                onTextSizeChange('small');
                                setCurrentTextSize('small');
                            }}
                            className={`text-lg font-bold px-7 py-3 ${currentTextSize === 'small' ? 'font-change-button text-white' : 'bg-gray-300 text-gray-700'}`}
                            aria-label="Small Text Size"
                        >
                            Small
                        </button>
                        <button
                            onClick={() => {
                                onTextSizeChange('medium');
                                setCurrentTextSize('medium');
                            }}
                            className={`text-lg font-bold px-7 py-3 ${currentTextSize === 'medium' ? 'font-change-button text-white' : 'bg-gray-300 text-gray-700'}`}
                            aria-label="Medium Text Size"
                        >
                            Medium
                        </button>
                        <button
                            onClick={() => {
                                onTextSizeChange('large');
                                setCurrentTextSize('large');
                            }}
                            className={`text-lg font-bold px-7 py-3 ${currentTextSize === 'large' ? 'font-change-button text-white' : 'bg-gray-300 text-gray-700'}`}
                            aria-label="Large Text Size"
                        >
                            Large
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccessibilityOptionsWindow;
