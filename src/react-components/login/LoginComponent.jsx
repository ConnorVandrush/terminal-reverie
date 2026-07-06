import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./LoginComponent.module.css";
import { clientLogin, clientRegister } from "@store/login/LoginSlice";

export default function Login() {
  const dispatch = useDispatch();

  const errorMessage = useSelector((state) => state.LoginSlice.errorMessage);
  const successMessage = useSelector(
    (state) => state.LoginSlice.successMessage,
  );

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    dispatch(clientLogin({ email, password }));
    passwordRef.current.value = "";
  };

  const handleRegister = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    dispatch(clientRegister({ email, password }));
    passwordRef.current.value = "";
  };

  return (
    <div className={styles.loginComponentStyle}>
      <div className={styles.title}>
        <h3>Login</h3>
      </div>
      <div className={styles.loginForm}>
        <div className={styles.emailInput}>
          <label htmlFor="email">Email:</label>
          <br />
          <input type="email" id="email" ref={emailRef} />
        </div>
        <div className={styles.passwordInput}>
          <label htmlFor="password">Password:</label>
          <br />
          <input type="password" id="password" ref={passwordRef} />
        </div>
        <div className={styles.loginButton}>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <div className={styles.registerButton}>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </div>
        <div className={styles.messages}>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {successMessage && (
            <p className={styles.successMessage}>{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
