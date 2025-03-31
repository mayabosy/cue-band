/**
 * 
 * Battery Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceContext = createContext();

export const useDevice = () => {
    return useContext(DeviceContext);
};

// Provider component to manage device state and operations
export const DeviceProvider = ({ children, device, setDevice }) => {
    const [server, setServer] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [firmwareVersion, setFirmwareVersion] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getFirmwareVersion = async () => {
            try {
                if (!server) {
                    throw new Error('Server is not connected');
                }

                const service = await server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb');
                const characteristic = await service.getCharacteristic('00002a26-0000-1000-8000-00805f9b34fb'); // Firmware Revision String
                const value = await characteristic.readValue();
                const decoder = new TextDecoder('utf-8');
                const firmware = decoder.decode(value);
                setFirmwareVersion(firmware);
            } catch (error) {
                console.error('Error getting firmware version:', error);
                setErrorMessage('Error getting firmware version', error);
            }
        };

        if (server) {
            getFirmwareVersion();
        }

        return () => {
        };
    }, [server]);

    // Connect to the device
    const connectToDevice = async () => {
        try {
            const bluetoothDevice = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: 'CueBand-'},
                ],
                optionalServices: [
                    'faa20000-3a02-417d-90a7-23f4a9c6745f',  // Schedule Service
                    '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // UART Service
                    '00001530-1212-efde-1523-785feabcd123', // DFU Service
                    '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service UUID
                    '00001805-0000-1000-8000-00805f9b34fb', // Current Time Service UUID
                    '00002a2b-0000-1000-8000-00805f9b34fb'
                ]
            });      
      
            const gattServer = await bluetoothDevice.gatt.connect();
            setDevice(bluetoothDevice);
            setServer(gattServer);

            const batteryService = await gattServer.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb');
            const batteryLevelCharacteristic = await batteryService.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb');
            const batteryValue = await batteryLevelCharacteristic.readValue();
            const level = batteryValue.getUint8(0);

            setBatteryLevel(level + '%');
        } catch (error) {
            setErrorMessage('Error connecting to device: ' + error.message);
        }
    };

    // Disconnect from the device
    const disconnectFromDevice = async () => {
        try { 
            if (server) {
                await server.disconnect();
                setDevice(null);
                setServer(null);
                setBatteryLevel(null);
                setFirmwareVersion(null);
                setErrorMessage(null);
            }
        } catch (error) {
            console.error('Error disconnecting from device:', error);
            setErrorMessage('Error disconnecting from device: ' + error.message);
        }
    };

    const deviceContextValue = {
        batteryLevel,
        firmwareVersion,
        connectToDevice,
        disconnectFromDevice,
        errorMessage,
        isConnected: !!device
    };

    return (
        <DeviceContext.Provider value={deviceContextValue}>
            {children} 
        </DeviceContext.Provider>
    );
};
