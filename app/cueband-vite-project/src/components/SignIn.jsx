/**
 * 
 * Sign In Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import withAccessibilityStyles from "./withAccessibilityStyles"

// Component for signing in
function SignIn({ userID, setUserID, signedIn, setSignedIn, style }) {
    // State variables
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [signInError, setSignInError] = useState(false)
    const errorColour = signInError ? "bg-red-200" : "bg-slate-100"
    
    // Navigation hook
    const navigate = useNavigate()

    // Function to parse JWT token
    const parseJwt = (token) => {
        const decode = JSON.parse(atob(token.split('.')[1]));
        console.log(decode);
        if (decode.exp * 1000 < new Date().getTime()) {
            signOut();
            console.log('Time Expired');
            window.alert("Session Expired")
        }
        return decode;
    };

    // Check for token in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = parseJwt(token);
            setUserID(decodedToken.id)
            setSignedIn(true);
        }
    }, []);

    // Function to sign in user
    const signIn = () => {
        // Encode email and password
        const encodedString = btoa(email + ':' + password)
        fetch('https://w20037161.nuwebspace.co.uk/cueband/api/token',
            {
                method: 'GET',
                headers: new Headers({ "Authorization": "Basic " + encodedString })
            })
            .then(response => {
                if (response.status === 401) {
                    setSignInError(true)
                    window.alert("Invalid Username or Password")
                    return
                }
                if (response.status === 200 || response.status === 204) {
                    return response.json()
                }
            })
            .then(data => {
                if (data && data.token) {
                    // Save token to localStorage
                    localStorage.setItem("token", data.token);
                    const decodedToken = parseJwt(data.token);
                    setUserID(decodedToken.id)
                    setSignedIn(true);
                    // Redirect to band page after successful sign-in
                    navigate("/band")
                }
            })
            .catch(error => console.log(error))
    }

    // Function to sign out user
    const signOut = () => {
        localStorage.removeItem("token")
        setEmail("")
        setPassword("")
        setSignedIn(false)
        // Redirect to aboutus page after sign-out
        navigate("/aboutus")
    }
  
    return (
        <div className="navbar-sign-in shadow-lg p-2 text-md text-right flex justify-between">
            {!signedIn && (
                <div style={style}>
                    <input
                        type="submit"
                        value="Register"
                        className="py-2 px-5 mx-2 register-button font-bold shadow-sm rounded-md"
                        onClick={() => navigate("/register")}

                    />
                </div>
            )}
            {!signedIn && (
                <div style={style}>
                    <input
                        type="text"
                        placeholder="E-mail"
                        className={'p-2 mx-2 custom-input'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={'p-2 mx-2 custom-input'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="submit"
                        value="Log In"
                        className="py-2 px-5 mx-2 sign-in-button font-bold shadow-sm rounded-md"
                        onClick={signIn}
                    />
                </div>
            )}
            {signedIn && (
                <div style={style}>
                    <input
                        type="submit"
                        value="Sign Out"
                        className="py-2 px-5 mx-2 sign-out-button text-stone-50 font-bold shadow-sm rounded-md"
                        onClick={signOut}
                    />
                </div>
            )}
            {signInError}
        </div>
    )
}
export default withAccessibilityStyles(SignIn)
