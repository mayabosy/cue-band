/**
 * 
 * Schedule Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import withAccessibilityStyles from '../components/withAccessibilityStyles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoBluetoothOverlay from '../components/NoBluetoothOverlay';
import { useVibration } from '../components/VibrationContext';

function Schedule({ style }) {
    // State variables to manage different aspects of the scheduling
    const [activeStep, setActiveStep] = useState(0);
    const [droolingFrequency, setDroolingFrequency] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [inactiveDays, setInactiveDays] = useState('');
    const [controlPoints, setControlPoints] = useState([]);
    const [scheduleStatus, setScheduleStatus] = useState(null);
    const [device, setDevice] = useState(null);
    const [server, setServer] = useState(null);
    const [selectedPartOfDay, setSelectedPartOfDay] = useState('');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showManualScheduling, setShowManualScheduling] = useState(false);
    const { vibrationStrength } = useVibration();

    // Handle frequency selection
    const handleFrequencySelection = (frequency) => {
        setDroolingFrequency(frequency);
        if (frequency === 'Never') {
            setActiveStep(4); // Skip to the final step if frequency is 'Never'
        } else if (frequency === 'Frequently - part of every day') {
            setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            setActiveStep(2); 
        } else if (frequency === 'Constantly - everyday') {
            setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            setSelectedPartOfDay('All Day');
            handleIntervalSelection('All Day'); // This will set the time slots for "All Day"
            setActiveStep(3); // Move directly to the time slot selection screen
        } else {
            setActiveStep(1);
        }
    };

    const toggleSummary = () => {
        setShowSummary(true); // Show the summary view
    };

    // Construct days byte representation for selected days
    const constructDaysByte = () => {
        return selectedDays.reduce((acc, day) => acc | (1 << daysOfWeek.indexOf(day)), 0);
    };

    // Toggle the selection of a day
    const toggleDaySelection = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    // Handles interval selection based on part of the day and sets appropriate time slots
    const handleIntervalSelection = (partOfDay) => {
        setSelectedPartOfDay(partOfDay);
        let slots;
        switch (partOfDay) {
            case 'Morning':
                slots = [
                    { label: '06:00 - 08:00', start: '06:00', end: '08:00' },
                    { label: '08:00 - 10:00', start: '08:00', end: '10:00' },
                    { label: '10:00 - 12:00', start: '10:00', end: '12:00' },
                ];
                break;
            case 'Afternoon':
                slots = [
                    { label: '12:00 - 14:00', start: '12:00', end: '14:00' },
                    { label: '14:00 - 16:00', start: '14:00', end: '16:00' },
                    { label: '16:00 - 18:00', start: '16:00', end: '18:00' },
                ];
                break;
            case 'Evening':
                slots = [
                    { label: '18:00 - 20:00', start: '18:00', end: '20:00' },
                    { label: '20:00 - 22:00', start: '20:00', end: '22:00' },
                    { label: '22:00 - 00:00', start: '22:00', end: '00:00' },
                ];
                break;
            case 'All Day':
                slots = [
                    { label: '06:00 - 12:00', start: '06:00', end: '12:00' },
                    { label: '12:00 - 18:00', start: '12:00', end: '18:00' },
                    { label: '18:00 - 00:00', start: '18:00', end: '00:00' },
                ];
                break;
            default:
                slots = [];
                break;
        }
        setTimeSlots(slots); // Set the time slots based on the part of the day selected
        setActiveStep(3);

    };


    // Confirm the schedule and ensure all required data is set
    const confirmSchedule = async () => {
        if (!selectedDays.length) {
            toast.error('Please select at least one day.');
            return;
        }

        if (!startTime || !endTime) {
            toast.error('Please ensure a time slot is selected.');
            return;
        }

        const startTimeDate = new Date(`1970-01-01T${startTime}`);
        const endTimeDate = new Date(`1970-01-01T${endTime}`);

        if (endTimeDate <= startTimeDate) {
            toast.error('End time must be after start time.');
            return;
        }

        await clearUnusedControlPoints()
        await setScheduleControlPoints();
        setShowSummary(true);
        setActiveStep(currentStep => currentStep + 1);
        toast.success('Schedule confirmed successfully!');
    };

    // Set schedule control points on the Bluetooth device
    async function setScheduleControlPoints() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }
        if (!selectedDays.length) {
            setErrorMessage('Error: No days have been selected.');
            return;
        }

        const controlPointData = constructControlPointData();
        if (!controlPointData) {
            setErrorMessage('Invalid time or days configuration.');
            return;
        }

        try {
            await clearUnusedControlPoints()
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const controlPointCharacteristic = await scheduleService.getCharacteristic('faa20002-3a02-417d-90a7-23f4a9c6745f');
            await controlPointCharacteristic.writeValue(controlPointData);
            toast.success('Control points set successfully!');

            await confirmScheduleStatus();
        } catch (error) {
            setErrorMessage('Error setting control points and storing the schedule: ' + error.message);
        }
    }

    // Navigate back to the previous step in the schedule setup
    const navigateBack = () => {
        // Check the current step and adjust based on the 'droolingFrequency' selected
        if (activeStep === 3 && droolingFrequency === 'Constantly - everyday') {
            // Skip the 'part of the day' step and go back to frequency selection
            setActiveStep(0);
        } else if (activeStep > 0) {
            // Normal behavior for other cases
            setActiveStep(current => current - 1);
        }
    };

    // Clear unused control points on the Bluetooth device
    async function clearUnusedControlPoints() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }

        try {
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const controlPointCharacteristic = await scheduleService.getCharacteristic('faa20002-3a02-417d-90a7-23f4a9c6745f');
            const curretDate = new Date();
            const currentDayIndex = curretDate.getDay();
            const daysToDisable = Array.from({ length: currentDayIndex }, (_, index) => (1 << index));

            for (const day of daysToDisable) {
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);
                dataView.setUint16(0, 1, true);
                dataView.setUint8(2, 0); // Intensity
                dataView.setUint8(3, day); // Days of week mask
                dataView.setUint16(4, 1092, true); // Time
                dataView.setUint16(6, 0, true); // Interval
                await controlPointCharacteristic.writeValue(buffer);
            }
        } catch (error) {
            setErrorMessage('Error setting non-Saturday inactive control points: ' + error.message);
        }
    }
    
    const renderButton = (text, onClick, isActive = false) => (
        <button
            onClick={onClick}
            className={`px-8 py-4 m-2 font-medium shadow-l ${isActive ? 'render-button text-slate-800' : 'bg-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-opacity-100`}
            style={style}
        >
            {text}
        </button>
    );

    // State hook for error message
    const [errorMessage, setErrorMessage] = useState('');

    // Navigation hook
    const navigate = useNavigate();

    // Parses the schedule status data
    function parseScheduleStatus(data) {
        const dataView = new DataView(data.buffer);
        return {
            currentControlPoint: dataView.getUint16(0, true),
            scheduleActive: dataView.getUint8(2)
        };
    }

    // Handles reconnecting to Bluetooth device
    useEffect(() => {
        async function autoReconnect() {
            try {
                if (navigator.bluetooth && typeof navigator.bluetooth.getDevices === 'function') {
                    const devices = await navigator.bluetooth.getDevices();
                    const device = devices.find(d => d.name && d.name.startsWith('CueBand') && d.gatt.connected);

                    if (device) {
                        const gattServer = await device.gatt.connect();
                        setDevice(device);
                        setServer(gattServer);
                    }
                }
            } catch (error) {
                setErrorMessage('Reconnection failed: ' + error.message);
            }
        }
        autoReconnect();
        if (server) {
            fetchScheduleStatus();
        }
    }, [server]);

    // Function to handle manual connection attempt
    const handleTryConnect = async () => {
        try {
            if (navigator.bluetooth && typeof navigator.bluetooth.requestDevice === 'function') {
                const bluetoothDevice = await navigator.bluetooth.requestDevice({
                    filters: [
                        { namePrefix: 'CueBand-' },
                    ],
                });
                const gattServer = await bluetoothDevice.gatt.connect();
                setDevice(bluetoothDevice);
                setServer(gattServer);
            }
        } catch (error) {
            toast.error('Connection failed');
            setErrorMessage('Connection failed');
        }
    };

    // Function to fetch schedule status
    async function fetchScheduleStatus() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }
        try {
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const statusCharacteristic = await scheduleService.getCharacteristic('faa20001-3a02-417d-90a7-23f4a9c6745f');
            const value = await statusCharacteristic.readValue();
            const status = parseScheduleStatus(value);
            setScheduleStatus(status);
            setErrorMessage('');

            if (status.currentControlPoint !== 0xffff) {
                fetchControlPoint(status.currentControlPoint);
            }
        } catch (error) {
            setErrorMessage('Error fetching schedule status');
        }
    }

    // Function to fetch control point data
    async function fetchControlPoint() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }

        try {
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const controlPointCharacteristic = await scheduleService.getCharacteristic('faa20002-3a02-417d-90a7-23f4a9c6745f');
            let points = [];
            let index = 0;

            while (true) {
                const response = await controlPointCharacteristic.readValue();

                if (response.byteLength === 0) {
                    break;
                }

                const point = parseControlPoint(response);

                if (point.intensity === 0 && point.minute === 1092) {
                    break;
                }

                points.push(point);
                index++;
            }

            const combinedPoints = combineControlPoints(points);
            setControlPoints(combinedPoints);
            const inactive = findInactiveDays(combinedPoints);
            setInactiveDays(inactive);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error fetching control points: ' + error.message);
        }
    }

    // Fetches the current schedule status from the Bluetooth device
    async function confirmScheduleStatus() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }

        try {
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const statusCharacteristic = await scheduleService.getCharacteristic('faa20001-3a02-417d-90a7-23f4a9c6745f');
            const value = await statusCharacteristic.readValue();
            const status = parseScheduleStatus(value);
            setScheduleStatus(status);
        } catch (error) {
            setErrorMessage('Error re-fetching schedule status: ' + error.message);
        }
    }

    // Sets the control points for the schedule based on selected days and times
    async function setScheduleControlPoints() {
        if (!server) {
            setErrorMessage('Bluetooth GATT server not connected.');
            return;
        }
        if (!selectedDays || selectedDays.length === 0) {
            setErrorMessage('Error: No days have been selected.');
            return;
        }
        try {
            const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
            const controlPointCharacteristic = await scheduleService.getCharacteristic('faa20002-3a02-417d-90a7-23f4a9c6745f');
            const controlPointData = constructControlPointData();
            await controlPointCharacteristic.writeValue(controlPointData);
            await storeSchedule();
            await confirmScheduleStatus();
        } catch (error) {
            setErrorMessage('Error setting control points and storing the schedule: ' + error.message);
        }

    }

    // Stores the schedule on the Bluetooth device
    async function storeSchedule() {
        const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
        const storeScheduleCharacteristic = await scheduleService.getCharacteristic('faa20001-3a02-417d-90a7-23f4a9c6745f');
        try {
            const newScheduleId = Math.floor(Date.now() / 1000); // Generate a unique schedule ID based on current timestamp
            const storeBuffer = new ArrayBuffer(8); // Create a buffer to hold schedule data
            const storeDataView = new DataView(storeBuffer);
            storeDataView.setUint8(0, 0x03);
            storeDataView.setUint8(1, 0x00);
            storeDataView.setUint8(2, 0x00);
            storeDataView.setUint8(3, 0x00);
            storeDataView.setUint32(4, newScheduleId, true); // Schedule ID
            // Write the schedule data buffer to the characteristic
            await storeScheduleCharacteristic.writeValue(storeBuffer);
        } catch (error) {
            throw new Error('Error storing the schedule: ' + error.message);
        }
    }

    // Constructs control point data for scheduling based on selected parameters
    function constructControlPointData() {
        if (!server || selectedDays.length === 0 || !startTime || !endTime) {
            setErrorMessage('Missing data or Bluetooth GATT server not connected.');
            return;
        }
        const startMinute = timeToMinutes(startTime);
        const endMinute = timeToMinutes(endTime);
        const interval = endMinute - startMinute;
        const daysByte = constructDaysByte(); // Bit representation of selected days
        const buffer = new ArrayBuffer(8);
        const dataView = new DataView(buffer);
        dataView.setUint16(0, 0, true); // Index
        dataView.setUint8(2, vibrationStrength); // Intensity
        dataView.setUint8(3, daysByte); // Days of week mask
        dataView.setUint16(4, startMinute, true); // Start time in minutes
        dataView.setUint16(6, interval, true); // Interval in minutes
        return buffer
    }

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    const toggleDay = (day) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Combines control points based on overlapping intervals
    function combineControlPoints(points) {
        const groupedByDays = points.reduce((acc, point) => {
            const key = point.days;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(point);
            return acc;
        }, {});

        const mergeIntervals = (points) => {
            if (points.length === 0) return [];
            points.sort((a, b) => a.minute - b.minute);
            let combinedStart = points[0].minute;
            let combinedEnd = points[0].minute + points[0].interval;

            points.forEach(point => {
                combinedEnd = Math.max(combinedEnd, point.minute + point.interval);
            });

            return [{
                days: points[0].days,
                start: combinedStart,
                end: combinedEnd
            }];
        };
        let combinedPoints = Object.values(groupedByDays).map(group => mergeIntervals(group)).flat();

        combinedPoints = combinedPoints.filter(point =>
            !(point.days === 'Sun, Mon, Tue, Wed, Thu, Fri, Sat' && point.start === 2 && point.end === 2)
        );

        return combinedPoints;
    }

    // Clears the schedule stored on the Bluetooth device
    async function clearSchedule() {
        const scheduleService = await server.getPrimaryService('faa20000-3a02-417d-90a7-23f4a9c6745f');
        const storeScheduleCharacteristic = await scheduleService.getCharacteristic('faa20001-3a02-417d-90a7-23f4a9c6745f');

        try {
            const clearBuffer = new ArrayBuffer(8);
            const clearDataView = new DataView(clearBuffer);
            clearDataView.setUint8(0, 0x03); // Set control command to clear schedule
            clearDataView.setUint32(4, 0xffffffff, true); // Set schedule ID to clear all schedules


            await storeScheduleCharacteristic.writeValue(clearBuffer);
        } catch (error) {
            setErrorMessage('Error clearing the schedule: ' + error.message);
        }
    }

    // Finds inactive days based on the control points
    function findInactiveDays(controlPoints) {
        const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activeDaysSet = new Set();

        // Iterate through control points to identify active days
        controlPoints.forEach(point => {
            point.days.split(', ').forEach(day => activeDaysSet.add(day));
        });

        const inactiveDays = allDays.filter(day => !activeDaysSet.has(day));
        return inactiveDays.join(', ');
    }

    // Parses control point data from DataView
    function parseControlPoint(data) {
        const dataView = new DataView(data.buffer);
        return {
            index: dataView.getUint16(0, true),
            intensity: dataView.getUint8(2),
            days: parseDays(dataView.getUint8(3)),
            minute: dataView.getUint16(4, true),
            interval: dataView.getUint16(6, true)
        };
    }

    // Handles selection of part of the day and triggers interval selection
    const handlePartOfDaySelection = (part) => {
        setSelectedPartOfDay(part);
        handleIntervalSelection(part);
    };

    // Parses days from byte representation
    function parseDays(daysByte) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let result = '';
        // Iterate through each bit of the byte to determine active days
        for (let i = 0; i < 7; i++) {
            if (daysByte & (1 << i)) {
                result += days[i] + ', ';
            }
        }
        return result.slice(0, -2);  // Remove trailing comma and space
    }

    // Function to parse schedule status data
    function parseScheduleStatus(data) {
        const dataView = new DataView(data.buffer);
        return {
            currentControlPoint: dataView.getUint16(0, true),
            scheduleActive: dataView.getUint8(2)
        };
    }

    // Formats time from minutes to HH:MM format
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const minutePart = minutes % 60;
        const formattedHours = hours === 24 ? '00' : String(hours).padStart(2, '0');
        const formattedMinute = String(minutePart).padStart(2, '0');
        return `${formattedHours}:${formattedMinute}`;
    };

    // Function to handle selection of time slot
    const handleTimeSlotSelection = (slot) => {
        let updatedSelection = [...selectedTimeSlots];
        const index = selectedTimeSlots.findIndex(s => s.label === slot.label);
        if (index > -1) {
            updatedSelection.splice(index, 1); // Deselect
            setStartTime('');
            setEndTime('');
        } else {
            updatedSelection.push(slot);
            setStartTime(slot.start); // Set start time from the slot
            setEndTime(slot.end); // Set end time from the slot
        }
        setSelectedTimeSlots(updatedSelection);
        toggleSummary(); // Assuming this updates a view or similar
    };

    // Function to handle scheduling
    async function handleSchedule() {
        await clearUnusedControlPoints()
        await setScheduleControlPoints()
        await fetchScheduleStatus()
        toast.success('Schedule set successfully!');
    }

    // Function to toggle manual scheduling view
    const toggleManualScheduling = () => {
        setShowManualScheduling(prevState => !prevState);
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-1">
            <ToastContainer />
            <NoBluetoothOverlay visible={!server} onTryConnect={handleTryConnect} />
            <div className="bg-white shadow-l p-8 mt-10 mb-4 w-full max-w-6xl">
                <h1 className="font-extrabold text-3xl mb-10 py-2 border-b-2 border-slate-400 text-custom-blue font-serif">Set Your Cueing Schedule</h1>
                <div className="w-full max-w-6xl" style={style}>
                    <div className="flex justify-end items-end flex-col">
                        <p className="text-gray-500 self-end mb-2">Don't want to use questionnaire? Set your scheduling manually:</p>
                        <button onClick={toggleManualScheduling} className="schedule-step-buttons text-white font-bold py-3 px-6 shadow-sm rounded-md focus:outline-none focus:shadow-outline">
                            {showManualScheduling ? "Hide Manual Scheduling" : "Manual Scheduling"}
                        </button>
                    </div>
                    {showManualScheduling && (
                        <div className="bg-gray-100 rounded-md shadow-md p-8 mt-10 mb-4" >
                            <div className="p-2 grid grid-cols-1 gap-2 ">

                                {daysOfWeek.map((day, index) => (
                                    <button key={index}
                                        onClick={() => toggleDay(day)}
                                        className={`w-full border-2 border-gray-300 ${selectedDays.includes(day) ? 'bg-yellow-400' : 'bg-gray-200'} hover:bg-yellow-300 text-slate-900 font-bold py-2 px-4 rounded-md transition duration-100 ease-in-out`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex space-x-4 items-center">
                                    <label htmlFor="startTime" className="text-gray-700 font-bold">
                                        Start:
                                    </label>
                                    <input
                                        id="startTime"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition duration-150 ease-in-out"
                                        style={{ minWidth: '200px' }}
                                    />

                                    <label htmlFor="endTime" className="text-gray-700 font-bold">
                                        End:
                                    </label>
                                    <input
                                        id="endTime"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition duration-150 ease-in-out"
                                        style={{ minWidth: '200px' }}
                                    />
                                </div>
                                <div>
                                    <button onClick={handleSchedule} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded">
                                        Set Schedule
                                    </button>
                                    <button onClick={clearSchedule} className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                        Clear Schedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <h1 className="font-semibold mb-8" style={style}></h1>
                <p className="mb-4 text-center font-bold text-blue-900" style={style}>
                    {activeStep === 0 && 'How often do you experience drooling?'}
                    {activeStep === 1 && 'Which days do you usually experience drooling?'}
                    {activeStep === 2 && 'Which part of the day do you usually experience drooling?'}
                    {activeStep === 3 && 'In which time slots do you experience drooling the most? You can pick more than one.'}
                    {activeStep === 4 && ''}
                </p>

                <div className="flex justify-center week-days-container">
                    {activeStep === 0 && ['Never', 'Frequently - part of every day', 'Occasionally - not every day', 'Constantly - everyday'].map(freq =>
                        renderButton(freq, () => handleFrequencySelection(freq))
                    )}
                    {activeStep === 1 && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day =>
                        renderButton(day, () => toggleDaySelection(day), selectedDays.includes(day))
                    )}
                    {activeStep === 2 && (
                        <div className="flex justify-center part-of-day-container">
                            {['Morning', 'Afternoon', 'Evening', 'All Day'].map(part =>
                                renderButton(part, () => handlePartOfDaySelection(part), selectedPartOfDay === part)
                            )}
                        </div>
                    )}
                </div>
                {activeStep === 3 && (
                    <div className="flex flex-col items-center justify-center w-full" style={style}>
                        <div className="bg-white p-8 mb-4 w-full max-w-md">
                            <div className="mb-4">
                                <strong>Part of Day:</strong> {selectedPartOfDay || 'Not specified'}
                            </div>
                            {timeSlots.length > 0 && (
                                <div className="mb-4">
                                    <strong>Time Slots:</strong>
                                    <div className="grid grid-cols-3 gap-6">
                                        {timeSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleTimeSlotSelection(slot)}
                                                className={`px-15 py-4 rounded-md focus:outline-none ${selectedTimeSlots.some(s => s.label === slot.label) ? 'bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                                                style={{ minWidth: 'calc(100% / 3 - 1.5rem)' }}
                                            >
                                                {slot.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeStep < 4 && (
                    <div className="flex justify-between mt-4 w-full py-8" style={style}>
                        <button onClick={navigateBack} className="schedule-step-buttons text-white font-bold py-3 px-6 shadow-sm rounded-md focus:outline-none focus:shadow-outline">
                            Previous
                        </button>
                        {activeStep !== 4 && (
                            <button onClick={() => setActiveStep(current => current + 1)} className="schedule-step-buttons text-white font-bold shadow-sm rounded-md py-3 px-6 focus:outline-none focus:shadow-outline">
                                Next
                            </button>
                        )}
                    </div>
                )}
                {activeStep === 4 && (
                    <div>
                        {showSummary && (
                            <div className="mt-8 w-full max-w-6xl flex justify-center">
                                <div className="bg-gray-100 rounded-md p-8 w-full">
                                    <h1 className="font-extrabold text-2xl mb-6 border-b-2 border-slate-400 text-custom-blue font-serif">Schedule Summary</h1>
                                    <div className="flex flex-col items-start">
                                        <div className="mb-4">
                                            <strong>Selected Days:</strong>
                                            <div>{selectedDays.join(', ')}</div>
                                        </div>
                                        <div className="mb-4">
                                            <strong>Part of Day:</strong> {selectedPartOfDay || 'Not specified'}
                                        </div>
                                        <div className="mb-4">
                                            <strong>Selected Time Slots:</strong>
                                            <div>
                                                {selectedTimeSlots.map(slot => `${slot.label}`).join(', ')}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                        {!showSummary && (
                            <div className="flex justify-between mt-4 w-full" style={style}>
                                <button onClick={navigateBack} className="schedule-step-buttons text-white font-bold py-3 px-6 shadow-sm rounded-md focus:outline-none focus:shadow-outline">
                                    Previous
                                </button>
                                <button onClick={() => setActiveStep(current => current + 1)} className="schedule-step-buttons text-white font-bold shadow-sm rounded-md py-3 px-6 focus:outline-none focus:shadow-outline">
                                    Next
                                </button>
                            </div>
                        )}
                        {showSummary && (
                            <div className="flex justify-between mt-4 w-full" style={style}>
                                <button onClick={navigateBack} className="schedule-step-buttons text-white font-bold py-3 px-6 shadow-sm rounded-md focus:outline-none focus:shadow-outline">
                                    Previous
                                </button>
                                <button onClick={confirmSchedule} className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 shadow-sm rounded-md focus:outline-none focus:shadow-outline">
                                    Confirm Schedule
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {activeStep === 5 && (
                    <p className="text-xl">Schedule set successfully. You can now close this window.</p>
                )}
            </div>
            <div className="w-full max-w-6xl" style={style}>
                <div className="mt-8 bg-gray-100 p-8 bg-white mb-5" style={style}>
                    <h1 className="font-extrabold text-3xl mb-6 border-b-2 border-slate-400 text-custom-blue font-serif">Current Schedule</h1>
                    <div className="gap-8">
                        {controlPoints.length > 0 ? (
                            <div className="bg-gray-200">
                                <div className="p-4 border-b border-gray-200 flex justify-between">
                                    <p className="text-gray-700 font-semibold">Days of Cueing</p>
                                    <p className="text-gray-700 font-semibold">Times of Cueing</p>
                                </div>
                                {controlPoints.map((point, index) => (
                                    <div key={index} className={`flex justify-between items-center p-4 border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <p className={`text-gray-700 ${point.days === 'Saturday' || point.days === 'Sunday' ? 'font-semibold' : ''}`}>{point.days}</p>
                                        <p className="text-gray-700">{formatTime(point.start)} - {formatTime(point.end)}</p>
                                    </div>
                                ))}
                                <div className="flex justify-center items-center">
                                    <button onClick={clearSchedule} className="bg-gray-600 font-bold hover:bg-gray-800 text-white py-1 px-2 ">
                                        Clear Schedule
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-4 border border-gray-200">
                                <p className="text-gray-700 font-semibold">No active schedule available.</p>
                                <p className="text-gray-500">Please set a schedule to continue.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}
export default withAccessibilityStyles(Schedule);
