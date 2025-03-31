/**
 * 
 * Text Size Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState } from 'react';
import FontSizeButton from './FontSizeButton';

const TextSizeController = () => {
    // State variable for text size
    const [textSize, setTextSize] = useState('small'); 

    // Handler for text size change
    const handleTextSizeChange = (size) => {
        setTextSize(size); 
    };

    return (
        <div>
            <p style={{ fontSize: textSize === 'small' ? '12px' : textSize === 'medium' ? '16px' : '24px' }}>
                Example text with font size: {textSize}
            </p>
            <FontSizeButton currentTextSize={textSize} onTextSizeChange={handleTextSizeChange} />
        </div>
    );
};

export default TextSizeController;
