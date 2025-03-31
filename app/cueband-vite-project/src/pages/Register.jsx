/**
 * 
 * Register Page
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState } from 'react'
import bcrypt from 'bcryptjs'
import { LuUserPlus } from "react-icons/lu";
import { useEffect } from 'react';
import withAccessibilityStyles from '../components/withAccessibilityStyles';
import { ToastContainer, toast } from 'react-toastify';

function RegistrationForm({ onRegistration, style }) {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const salt = bcrypt.genSaltSync(10) 
    const [passwordStrength, setPasswordStrength] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // Check password strength
    const checkPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength += 1
        if (password.length >= 12) strength += 1
        if (/\d/.test(password)) strength += 1
        if (/[a-z]/.test(password)) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1

        // Return password strength based on criteria
        switch (strength) {
            case 0:
            case 1:
            case 2:
                return 'Weak'
            case 3:
            case 4:
                return 'Moderate'
            case 5:
            case 6:
                return 'Strong'
            default:
                return '' 
        }
    }

    // Determine password strength text class
    const getPasswordStrengthTextClass = () => {
        switch (passwordStrength) {
            case 'Weak':
                return 'text-green-500'
            case 'Moderate':
                return 'text-orange-500'
            case 'Strong':
                return 'text-red-500'
            default:
                return ''
        }
    }

    // Effect to update password strength when password changes
    useEffect(() => {
        if (password) {
            setPasswordStrength(checkPasswordStrength(password));
        }
    }, [password]);


    // Handler for password change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        setPasswordStrength(checkPasswordStrength(newPassword))
    }

    // Handler for confirm password change
    const handleConfirmPasswordChange = (e) => {
        const newPassword = e.target.value
        setConfirmPassword(newPassword)
    }

     // Handle user registration
    const handleRegistration = () => {
        const nameRegex = /^[a-zA-Z\s]*$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation checks
        if (!name.match(nameRegex)) {
            setErrorMessage('Please enter a valid name with no special characters or numbers.');
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.')
            return
        }

        if (!email.match(emailRegex)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // Check if all fields are filled
        if (name.trim() !== '' && email.trim() !== '' && password.trim() !== '') {
            const hashedPassword = bcrypt.hashSync(password, salt) 

            let formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', hashedPassword)

            // Send registration request to the server
            fetch('https://w20037161.nuwebspace.co.uk/cueband/api/register', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (response.status === 200 || response.status === 204) {
                        toast.success('Account created sucessfully!');
                        window.location.href = '/aboutus/'
                    } else if (response.status === 450) { 
                        response.json().then(data => {
                            setErrorMessage(data.error || 'Email already exists.');
                        });
                    } else {
                        response.json().then(data => {
                            setErrorMessage(data.error || 'Registration failed. Please try again later.');
                        });
                    }
                })
                .catch(error => {
                    setErrorMessage('Registration failed. Please try again later.');
                });
        } else {
            setErrorMessage('Please fill in all fields.');
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center py-8" style={style}>
            <div className="bg-gray-100 shadow-md p-8 max-w-lg w-full">
                <div className="flex justify-center mb-4 ">
                    <LuUserPlus className="text-gray-600 text-slate-900" style={{ fontSize: '4rem' }} />
                </div>
                <h1 className="text-center font-extrabold text-3xl mb-6 border-b-2 border-slate-400 text-custom-blue font-serif">Create a new account</h1>
                {errorMessage && (
                    <div className="bg-red-500 text-white p-2 mb-4 text-center">{errorMessage}</div>
                )}
                <div className="grid grid-cols-1 gap-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-semibold text-gray-700">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Please enter your full name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            aria-label="Full Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block font-semibold text-gray-700">E-mail</label>
                        <input
                            id="email"
                            type="text"
                            placeholder="Please enter your e-mail..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            aria-label="Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block font-semibold text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="border border-gray-300 px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            aria-label="Password"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="border border-gray-300 px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            aria-label="Confirm Password"
                        />
                    </div>
                </div>
                {password && ( 
                    <div className="text-gray-600 mt-10">
                        Password strength: <span className={getPasswordStrengthTextClass()}>{passwordStrength}</span>
                    </div>
                )}
                <div className="mt-4">
                    <button
                        onClick={handleRegistration}
                        className="bg-sky-900 text-white px-4 py-2 font-bold rounded-md hover:bg-sky-950 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
export default withAccessibilityStyles(RegistrationForm)

