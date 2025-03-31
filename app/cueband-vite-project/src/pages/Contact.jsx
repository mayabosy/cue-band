/**
 * 
 * Contact Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import { Link } from 'react-router-dom';
import withAccessibilityStyles from '../components/withAccessibilityStyles';

function ContactPage({ style }) {
    return (
        <div className="flex flex-col items-center justify-center bg-white mt-8">
            <div className="max-w-2xl w-full rounded-lg p-6 text-center mt-4 mb-8" style={style}>
                <h1 className="font-extrabold text-5xl mb-6 border-b-2 border-slate-400 text-custom-blue font-serif">Contact Us</h1>
                <p className="mb-6 text-gray-700">Do you have any questions about the Cue Band technology or the study? Check out our FAQs or get in touch with our research team.</p>
                <p className="mb-6 text-gray-700">Please email us at:</p>
                <ul className="list-disc pl-4 mb-6 text-left">
                    <li className="mb-2">
                        <a href="mailto:contact@cue.band" className="text-blue-500 hover:underline">contact@cue.band</a> (For study participation questions)
                    </li>
                    <li className="mb-2">
                        <a href="mailto:support@cue.band" className="text-blue-500 hover:underline">support@cue.band</a> (For technical support or issues with Cue Band)
                    </li>
                </ul>
                <p className="text-gray-700">
                    Alternatively, you can reach out to us via our <Link to="/faq" className="text-blue-500 hover:underline">Frequently Asked Questions</Link> page.
                </p>
            </div>
        </div>
    );
};

export default withAccessibilityStyles(ContactPage);
