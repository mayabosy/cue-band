/**
 * 
 * About Us Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CueBandLogo from '../assets/cueband-logo.png';
import withAccessibilityStyles from '../components/withAccessibilityStyles';

function AboutUs({ style }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4" style={style}>
            <img src={CueBandLogo} alt="CueBand Logo" className="w-600 h-60 mb-8 border-b-2 border-gray-300" />
            <div className="max-w-4xl mx-auto text-justify">
                <p className="text-gray-700 mb-4">
                    CueBand is on a mission to revolutionize the management of drooling symptoms in individuals with Parkinson’s disease. With our innovative cueing technology, we aim to empower individuals to take control of their symptoms like never before.
                </p>

                <p className="text-gray-700 mb-8">
                    Sialorrhoea, also known as drooling, affects up to 80% of people with Parkinson's. CueBand, funded by Parkinson's UK, is developing cutting-edge cueing devices to significantly reduce drooling symptoms and enhance the quality of life for individuals living with Parkinson's.
                </p>

                <p className="text-gray-700 mb-4">
                    To access the full functionality of CueBand and embark on your journey towards managing drooling symptoms effectively, please
                    <Link to="/register" className="register-link font-bold hover:underline ml-1 mr-1">register</Link> if you're new to CueBand or
                    <span className="font-bold"> log in</span> if you're an existing member.
                </p>
            </div>

            <ToastContainer />
        </div>
    );
};

export default withAccessibilityStyles(AboutUs);
