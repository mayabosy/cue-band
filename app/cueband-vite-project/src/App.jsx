/**
 * 
 * App 
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Schedule from './pages/Schedule';
import AccessibilityOptionsWindow from './components/AccessibilityOptionsWindow';
import { IoAccessibility } from 'react-icons/io5';
import Band from './pages/Band';
import { useSpring, animated } from 'react-spring';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DeviceProvider } from './components/BatteryComponent';
import SignIn from './components/SignIn';
import RegistrationForm from './pages/Register';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Journal from './pages/Journal';
import NotFound from './pages/NotFound';
import { VibrationProvider } from './components/VibrationContext';

function App() {
  // State variable
  const [isAccessibilityWindowOpen, setIsAccessibilityWindowOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [server, setServer] = useState(null);
  const [device, setDevice] = useState(null);
  const [mac, setMac] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [userID, setUserID] = useState([]);

  const [accessibilityOptions, setAccessibilityOptions] = useState({
    textSize: 'normal',
  });

  // Function to fetch schedule status from the Bluetooth device
  async function fetchScheduleStatus(server) {
    if (!server) {
      setErrorMessage('Bluetooth GATT server not connected.');
      return;
    }

    try {
      const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
      const statusCharacteristic = await scheduleService.getCharacteristic('faa20001-3a02-417d-90a7-23f4a9c6745f');
      const value = await statusCharacteristic.readValue();
      console.log('Received data length:', value.byteLength);

      const status = parseScheduleStatus(value);
      console.log('Parsed Schedule Status:', status);
      setScheduleStatus(status);
      setErrorMessage('');

      if (status.currentControlPoint !== 0xffff) {
        fetchControlPoint(status.currentControlPoint);
      }
    } catch (error) {
      console.error('Error fetching schedule status:', error);
      setErrorMessage('Error fetching schedule status: ' + error.message);
    }
  }

  // Spring animation for button click effect
  const buttonClickSpring = useSpring({
    transform: buttonClicked ? 'scale(1.2)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  // Handler for button click to toggle accessibility window
  const handleButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 200);
    setIsAccessibilityWindowOpen(!isAccessibilityWindowOpen);
  };

  // Handler for toggling the accessibility window
  const handleToggleAccessibilityWindow = () => {
    setIsAccessibilityWindowOpen(!isAccessibilityWindowOpen);
  };

  // Handler for changing text size in accessibility options
  const handleTextSizeChange = (newSize) => {
    setAccessibilityOptions(prevOptions => ({
      ...prevOptions,
      textSize: newSize
    }));
  };

  // Handler for clicking on the accessibility window
  const handleAccessibilityWindowClick = (e) => {
    if (e.target.classList.contains('accessibility-window')) {
      handleToggleAccessibilityWindow();
    }
  };

  // Effect to handle initial text size change
  useEffect(() => {
    handleTextSizeChange();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <div className="">
        <SignIn
          signedIn={signedIn}
          setSignedIn={setSignedIn}
          userID={userID}
          setUserID={setUserID}
          accessibilityOptions={accessibilityOptions}
        />
      </div>
      <nav>
        <Menu
          accessibilityOptions={accessibilityOptions}
          onTextSizeChange={handleTextSizeChange}
          signedIn={signedIn}
        />
      </nav>
      <main className="flex-grow">
        <VibrationProvider>
        <DeviceProvider device={device} setDevice={setDevice}>
          <Routes>
            <Route path="/band" element={<Band device={device} accessibilityOptions={accessibilityOptions} mac={mac} setMac={setMac} />} />
            <Route path="/schedule" element={<Schedule accessibilityOptions={accessibilityOptions} />} server={server} setServer={setServer} />
            <Route path="/journal" element={<Journal accessibilityOptions={accessibilityOptions} userID={userID} setUserID={setUserID} server={server} fetchScheduleStatus={fetchScheduleStatus} />} />
            <Route path="/register" element={<RegistrationForm accessibilityOptions={accessibilityOptions} />} />
            <Route path="/aboutus" element={<AboutUs accessibilityOptions={accessibilityOptions} />} />
            <Route path="/contact" element={<Contact accessibilityOptions={accessibilityOptions} />} />
            <Route path="*" element={<NotFound accessibilityOptions={accessibilityOptions} />} />
          </Routes>
        </DeviceProvider>
        </VibrationProvider>
      </main>
      <footer>
        <Footer accessibilityOptions={accessibilityOptions} />
      </footer>
      {/* Accessibility button */}
      <button
        style={{ ...buttonClickSpring }}
        onClick={handleButtonClick}
        className="accessibility-button fixed-button fixed bottom-8 right-8 p-4 text-slate-700 rounded-full shadow-lg"
        aria-label="Accessibility Options"
      >
        <IoAccessibility className="w-9 h-9" />
      </button>
      {/* Accessibility Options Window */}
      {isAccessibilityWindowOpen && (
        <div className="accessibility-window" onClick={handleAccessibilityWindowClick}>
          <AccessibilityOptionsWindow
            isOpen={isAccessibilityWindowOpen}
            onClose={handleToggleAccessibilityWindow}
            accessibilityOptions={accessibilityOptions}
            onTextSizeChange={handleTextSizeChange}
            className="accessibility-window"
          />
        </div>
      )}
    </div>
  );
}

export default App;
