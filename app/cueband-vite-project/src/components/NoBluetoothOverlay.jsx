/**
 * 
 * No Bluetooth Overlay Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';

const NoBluetoothOverlay = ({ visible, onTryConnect }) => {
    // If the overlay is not visible, return null
    if (!visible) return null;

    // Render the overlay
    return (
        <div className="fixed inset-0 w-full min-h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <p className="text-lg font-bold mb-4">You are not connected to Bluetooth. </p>
                <p className="mb-4">Please connect to the CueBand to access this page.</p>
                <button onClick={onTryConnect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Connect
                </button>
            </div>
        </div>
    );
};

export default NoBluetoothOverlay;
