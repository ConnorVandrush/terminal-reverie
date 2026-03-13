import React, { useRef } from "react";
import { useDispatch } from "react-redux";

import styles from './Login.module.css';

export default function Login()
{
    const emailRef = useRef();
    const passwordRef = useRef();

    const dispatch = useDispatch();

    const handleLogin = () =>
    {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        dispatch({ type: 'LOGIN', payload: { email, password } });
    };

    const handleRegister = () =>
    {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        dispatch({ type: 'REGISTER', payload: { email, password } });
    };

    return (
        <div className={styles.login}>
            <h3>Login</h3>
            <div className={styles.loginForm}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" className={styles.input} ref={emailRef} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" className={styles.input} ref={passwordRef} />
                </div>
                <button type="button" id="loginButton" onClick={handleLogin} >Login</button>
                <button type="button" id="registerButton" onClick={handleRegister} >Register</button>
            </div>
        </div>
    );
}