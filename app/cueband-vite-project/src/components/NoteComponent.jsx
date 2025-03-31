/**
 * 
 * Note Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState, useEffect } from 'react';
import '/src/index.css';
import BigCalendar from '../components/CalendarComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component for adding notes to the diary
function NoteComponent({ userID, setUserID}) {
    // State variables
    const [date, setDate] = useState('');
    const [currentDay, setCurrentDay] = useState(new Date());
    const [symptoms, setSymptoms] = useState('');
    const [diary, setDiary] = useState([]);
    const [step, setStep] = useState(1); 
    const [note, setNote] = useState('');
    const [power, setPower] = useState('');
    const [hour, setHour] = useState('');
    const [strength, setStrength] = useState(''); 
    const currentHour = new Date().getHours().toString().padStart(2, '0');
    const currentMinute = new Date().getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    // Function to parse JWT token
    const parseJwt = (token) => {
        const decode = JSON.parse(atob(token.split('.')[1]));
        return decode;
    };

    // Fetch diary entries on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = parseJwt(token);
            setUserID(decodedToken.id)
            getDiary(userID);
        }
    }, []);

    // Function to fetch diary entries
    const getDiary = (userID) => {
        fetch('https://w20037161.nuwebspace.co.uk/cueband/api/diary?user=' + userID, {
            method: 'GET',
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(data => {
                setDiary(data);
            })
    }

    // Function to add a new diary entry
    const addDiary = () => {
        let formData = new FormData();
        const formattedDate = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;
        formData.append('note', note);
        formData.append('date', formattedDate); 
        formData.append('user', userID);
        formData.append('strength', strength);
        formData.append('hour', currentTime);

        fetch('https://w20037161.nuwebspace.co.uk/cueband/api/diary', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (response.status === 204) {
                    toast.success('Note added successfully!');
                    getDiary();
                    window.location.reload()
                    return;
                } else if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Failed to update the data. Server returned status: ' + response.status);
                }
            })
            .then(data => {
                if (data) {
                    setNote(data[0].note)
                    setDate(data[0].date)
                    setHour(data[0].hour)
                    setPower(data[0].strength)
                    getDiary(userID);
                }
            })
            .catch(error => {
                window.alert(error.message);
            });
    }

    // Function to handle change in selected day
    const handleDayChange = (day) => {
        setCurrentDay(day);
    };

     // Function to handle change in selected symptoms
    const handleSymptomsChange = (symptoms) => {
        setSymptoms(symptoms);
        switch (symptoms) {
            case 'Great':
                setStrength(1);
                break;
            case 'Okay':
                setStrength(2);
                break;
            case 'Not Bad':
                setStrength(3);
                break;
            case 'Bad':
                setStrength(4);
                break;
            default:
                setStrength(''); 
        }
    };
    const containerStyle = {
        maxWidth: '1200px', 
        margin: 'auto',
        padding: '20px', 
    };

    const headerStyle = {
        fontWeight: 'bold',
        marginBottom: '16px',
        textAlign: 'left' 
    };


    let diaryPage;
    switch (step) {
        case 1:
            diaryPage = (
                <div style={containerStyle}>
                <ToastContainer />
                <div className="bg-white shadow-md p-4">
                    <h1 style={headerStyle}>Please describe the severity of your drooling for this day:</h1>
                    {/* Symptoms Assessment */}
                    <div className="flex flex-col justify-center items-center gap-4 p-8">
                        <button
                            onClick={() => handleSymptomsChange('Great')}
                            className={`w-full bg-blue-200 text-blue-800 px-6 py-3 font-bold hover:bg-blue-300 focus:outline-none focus:bg-blue-300 rounded-md ${symptoms === 'Great' ? 'border-blue-500 border-4' : 'border-transparent'}`}
                        >
                            Absent: No occurrence of drooling
                        </button>
                        <button
                            onClick={() => handleSymptomsChange('Okay')}
                            className={`w-full bg-green-200 text-green-800 px-6 py-3 font-bold hover:bg-green-300 focus:outline-none focus:bg-green-300 rounded-md ${symptoms === 'Okay' ? 'border-green-500 border-4' : 'border-transparent'}`}
                        >
                            Mild: Occasional and minimal drooling
                        </button>
                        <button
                            onClick={() => handleSymptomsChange('Not Bad')}
                            className={`w-full bg-yellow-200 text-yellow-800 px-6 py-3 font-bold hover:bg-yellow-300 focus:outline-none focus:bg-yellow-300 rounded-md ${symptoms === 'Not Bad' ? 'border-yellow-500 border-4' : 'border-transparent'}`}
                        >
                            Moderate: Some noticeable drooling, but manageable
                        </button>
                        <button
                            onClick={() => handleSymptomsChange('Bad')}
                            className={`w-full bg-red-200 text-red-800 px-6 py-3 font-bold hover:bg-red-300 focus:outline-none focus:bg-red-300 rounded-md ${symptoms === 'Bad' ? 'border-red-500 border-4' : 'border-transparent'}`}
                        >
                            Severe: Persistent and significant drooling throughout the day
                        </button>
                    </div>
                    {/* Button Group */}
                    <div className="flex justify-between p-4">
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 font-bold hover:bg-gray-400 rounded-md focus:outline-none" onClick={() => setStep(step - 1)}>Previous</button>
                        <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 font-bold rounded-md focus:outline-none" onClick={() => setStep(step + 1)}>Next</button>
                    </div>
                </div>
            </div>
            
            );
            break;
        case 2:
            diaryPage = (
                <div style={containerStyle} >
                    <div className="bg-white shadow-md p-4">
                        <h1 style={headerStyle}>Please select the day of the diary entry:</h1>
                        <div className="p-4">
                            <BigCalendar
                                value={currentDay}
                                onChange={handleDayChange}
                            />
                        </div>
                        <div className="flex justify-between p-4">
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 font-bold hover:bg-gray-400 rounded-md focus:outline-none" onClick={() => setStep(step - 1)}>Previous</button>
                            <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 font-bold rounded-md focus:outline-none" onClick={() => setStep(step + 1)}>Next</button>
                        </div>
                    </div>
                </div>
            );
            break;
        case 3:
            diaryPage = (
                <div style={containerStyle} >
                    <div className="bg-white shadow-md p-4">
                        <h1 style={headerStyle}>Do you have any notes you would like to leave?</h1>
                        {/* Leave Notes */}
                        {step === 3 && (
                            <div className="p-8">
                                <textarea
                                    id="note"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Leave any note here..."
                                    className="w-full h-40 px-2 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-sky-950 focus:ring-1 focus:ring-indigo-500"
                                    />
                            </div>
                        )}
                        {/* Button Group */}
                        <div className="flex justify-between p-4">
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 font-bold hover:bg-gray-400 rounded-md focus:outline-none" onClick={() => setStep(step - 1)}>Previous</button>
                            <button className="bg-yellow-400 text-slate-700 px-4 py-2 font-bold hover:bg-yellow-600 rounded-md focus:outline-none" onClick={addDiary}>Submit</button>
                        </div>
                    </div>
                </div>
            );
            break;
        default:
    }
    return diaryPage;
}

export default NoteComponent;
