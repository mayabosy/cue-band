/**
 * 
 * Not Found Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import { Link } from 'react-router-dom';
import withAccessibilityStyles from '../components/withAccessibilityStyles';

function NotFound({ style }) {
    return (
        <div className="flex flex-col items-center justify-center bg-white mt-8"> 
            <div className="max-w-2xl w-full rounded-lg p-6 text-center mt-4 mb-8" style={style}> 
                <h1 className="font-extrabold text-5xl mb-6 border-b-2 border-slate-400 text-custom-blue font-serif">404 - Page Not Found</h1>
                <p className="mb-6 text-gray-700">Oops! Looks like you're lost.</p>
                <p className="mb-6 text-gray-700">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <p className="text-gray-700">
                    You can go back to the <Link to="/aboutus" className="text-blue-500 hover:underline">About Us</Link> or check out our <Link to="/faq" className="text-blue-500 hover:underline">Frequently Asked Questions</Link> page.
                </p>
            </div>
        </div>
    );
};

export default withAccessibilityStyles(NotFound);
