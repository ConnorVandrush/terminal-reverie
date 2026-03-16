import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from './Login.module.css';
import { clientLogin, clientRegister } from "@store/loginSlice";

export default function Login()
{
    const dispatch = useDispatch();

    const errorMessage = useSelector((state) => state.login.errorMessage);
    const successMessage = useSelector((state) => state.login.successMessage);

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleLogin = () =>
    {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        dispatch(clientLogin({ email, password }));
        passwordRef.current.value = '';
    };

    const handleRegister = () =>
    {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        dispatch(clientRegister({ email, password }));
        passwordRef.current.value = '';
    };

    return (
        <div className={styles.login}>
            <div className={styles.loginForm}>
                <h3>Login</h3>
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
            <div className={styles.messages}>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
            </div>
        </div>
    );
}