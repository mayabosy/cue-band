import React, { createContext, useState, useContext } from 'react';

const VibrationContext = createContext();

export const useVibration = () => useContext(VibrationContext);

export const VibrationProvider = ({ children }) => {
    // State variable for vibration strength with default value set to medium
    const [vibrationStrength, setVibrationStrength] = useState(2); 

    return (
        <VibrationContext.Provider value={{ vibrationStrength, setVibrationStrength }}>
            {children}
        </VibrationContext.Provider>
    );
};
