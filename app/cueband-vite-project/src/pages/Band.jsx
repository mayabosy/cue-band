import React, { useState } from 'react';
import { useDevice } from '../components/BatteryComponent';
import PinetimeImage from '../assets/pinetime.jpeg';
import withAccessibilityStyles from '../components/withAccessibilityStyles';
import { ToastContainer, toast } from 'react-toastify';
import { useVibration } from '../components/VibrationContext';
import 'react-toastify/dist/ReactToastify.css';
import ChromeFlagsTutorial from '../components/ChromeFlagsTutorial';

const Band = ({ style, device }) => {
  const { batteryLevel, firmwareVersion, connectToDevice, disconnectFromDevice, isConnected, errorMessage } = useDevice();
  const { vibrationStrength, setVibrationStrength } = useVibration();
  const [showTutorial, setShowTutorial] = useState(false); // State to control the visibility of the tutorial

  // Function to synchronize time and date with the device
  const syncTimeAndDate = async () => {
    // Get the current date and time
    const currentDate = new Date();

    // Extract individual components of the date and time
    const yearValue = currentDate.getFullYear();
    const monthValue = currentDate.getMonth() + 1; // Months are 0-based
    const dayValue = currentDate.getDate();
    const hourValue = currentDate.getHours();
    const minuteValue = currentDate.getMinutes();
    const secondValue = currentDate.getSeconds();
    const weekdayValue = currentDate.getDay();
    const microsecondValue = Math.floor(currentDate.getMilliseconds() * 1e6 / 256);

    // Constructing date and time data packet
    const dateTimeData = new Uint8Array([
      yearValue & 0xFF, yearValue >> 8, // Year (split into two bytes)
      monthValue,
      dayValue,
      hourValue,
      minuteValue,
      secondValue,
      weekdayValue,
      microsecondValue,
      0x01 // Termination flag
    ]);

    try {
      // Write time and date data to the device
      await writeTimeCharacteristic(dateTimeData);
      toast.success('Time and date synced successfully', {
        className: 'toast-success',
      });
    } catch (error) {
      toast.error('Error syncing time and date', {
        className: 'toast-error',
      });
    }
  };
  // Function to handle click on tutorial link
  const handleTutorialClick = () => {
    setShowTutorial(prevState => !prevState); // Toggle the state
  };

  // Function to write time characteristic to the device
  const writeTimeCharacteristic = async (data) => {
    try {
      // Check if device is connected
      if (!device) {
        console.error('Device is not connected');
        return;
      }
      const gattServer = await device.gatt.connect(); // Connect to GATT server
      const service = await gattServer.getPrimaryService('00001805-0000-1000-8000-00805f9b34fb'); // Get primary service
      const characteristic = await service.getCharacteristic('00002a2b-0000-1000-8000-00805f9b34fb'); // Get time characteristic
      await characteristic.writeValue(data); // Write time data
    } catch (error) {
      toast.error('Error setting data', {
        className: 'toast-error',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={style}>
      <ToastContainer />
      {showTutorial && <ChromeFlagsTutorial />}
      <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl flex flex-wrap justify-center items-center" aria-label="CueBand Smartwatch Information">
        <div className="flex-none mr-4 mb-4 md:mb-0">
          <img src={PinetimeImage} alt="PineTime Smartwatch" className="w-64 h-auto" aria-hidden="true" />
        </div>
        {isConnected ? (
          <div className="flex-grow w-full md:w-1/2 md:pl-4">
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h1 className="font-extrabold text-3xl mb-4 border-b-2 border-slate-400 text-custom-blue font-serif">Details</h1>
              <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="text-gray-600 font-bold">Battery Level:</div>
                <div className="text-gray-800 font-semibold">{batteryLevel}</div>
                <div className="text-gray-600 font-bold">Firmware Version:</div>
                <div className="text-gray-800 font-semibold">{firmwareVersion}</div>
                <div className="text-gray-600 font-bold">Model:</div>
                <div className="text-gray-800 font-semibold">CueBand</div>
              </div>
              <h1 className="font-extrabold text-3xl mb-4 border-b-2 border-slate-400 text-custom-blue font-serif">Settings</h1>
              <div className="mb-4">
                <label htmlFor="vibrationStrength" className="block text-gray-700 font-bold mb-2">Vibration Strength:</label>
                <select id="vibrationStrength" value={vibrationStrength} onChange={(e) => setVibrationStrength(e.target.value)} className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-100 w-full">
                  <option value="0">Off</option>
                  <option value="1">Short</option>
                  <option value="2">Medium</option>
                  <option value="3">Long</option>
                  <option value="4">2xShort</option>
                  <option value="5">2xLong</option>
                  <option value="6">3xShort</option>
                  <option value="7">3xLong</option>
                </select>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={syncTimeAndDate}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
                  aria-label="Sync Time and Date"
                >
                  Sync Time and Date
                </button>
                <button
                  onClick={disconnectFromDevice}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg"
                  aria-label="Disconnect Device"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center w-full md:w-1/2 md:text-center" role="group" aria-label="Connect Cue Band">
            <h1 className="font-extrabold text-3xl mb-4 border-b-2 border-slate-400 text-custom-blue font-serif">Connect your CueBand</h1>
            <div>
              <ol className="pl-4 md:pl-6">
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">1.</span> Ensure you are using Google Chrome or Microsoft Edge browser.
                  </p>
                </li>
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">2.</span> Ensure the Web Bluetooth API is allowed. Don't know how? <span className="text-blue-500 cursor-pointer" onClick={handleTutorialClick}>Click here for a tutorial.</span>
                  </p>
                </li>
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">3.</span> Ensure your CueBand is powered on and within close proximity.
                  </p>
                </li>
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">4.</span> Activate the Bluetooth feature on your device.
                  </p>
                </li>
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">5.</span> Click "Connect" and search for available devices.
                  </p>
                </li>
                <li className="mb-2 md:mb-4">
                  <p className="text-gray-600 mb-1 text-justify">
                    <span className="font-bold text-custom-blue">6.</span> Once your CueBand appears in the list, select it.
                  </p>
                </li>
              </ol>
            </div>
            <div className="flex justify-center mt-2 mb-2">
              <button
                onClick={connectToDevice}
                className="band-connect-button w-full shadow-md text-slate-700 font-bold py-3 md:py-4 rounded-lg text-xl"
                aria-label="Connect Device"
                role="button"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );


}

export default withAccessibilityStyles(Band);
