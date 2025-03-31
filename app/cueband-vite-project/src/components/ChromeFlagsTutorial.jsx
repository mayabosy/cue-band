/**
 * 
 * Chrome Flags Tutorial Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';

// ChromeFlagsTutorial functional component
function ChromeFlagsTutorial() {
    // Function to close modal
    const closeModal = () => {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    };
    
    // Rendering ChromeFlagsTutorial component
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Enable Web Bluetooth in Google Chrome</h1>
                    <p className="text-lg text-gray-600 mb-6">Let’s enable Web Bluetooth for a seamless browsing experience. Please follow these simple steps:</p>
                    <ol className="text-lg text-gray-700 mb-6">
                        <li>
                            <strong>Open Chrome Flags:</strong> Type <code><strong className="text-blue-500">chrome://flags/#enable-web-bluetooth-new-permissions-backend</strong></code> into the address bar at the top of the Chrome window and press 'Enter'.
                        </li>
                        <li>
                            <strong>Activate Web Bluetooth:</strong> You will be directed to the Chrome Flags page with the relevant feature highlighted. Find the setting named "Web Bluetooth new permissions backend" and select <strong>Enabled</strong> from the dropdown next to it.
                        </li>
                        <li>
                            <strong>Restart Chrome:</strong> Once enabled, a blue "Relaunch" button will appear at the bottom of the page. Click this button to restart Chrome and apply the changes.
                        </li>
                    </ol>

                    <p className="text-lg text-gray-700 mb-6">If you encounter any issues or need further assistance, our support team is here to help!</p>

                    <div className="bg-gray-200 rounded-lg p-4 mb-6">
                        <p className="text-lg text-gray-800"><strong>Note:</strong> Enabling Web Bluetooth may enhance your browsing experience. If you experience any issues, you can revert to the default settings by selecting "Default" in the same menu.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChromeFlagsTutorial;
