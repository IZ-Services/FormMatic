'use client';
import React from 'react';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../globals.css';
import app from '../../../firebase-config';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const auth = getAuth(app);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCredential.user;
      })
      .catch((error) => {
        error.code;
        error.message;
        setLoginError(true);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="center-container">
        <div>
          <h1 className="login-CompanyName">FormMatic</h1>
          <p className="login-companySlogan">From Data to Documents in Seconds.</p>
          <h2 className="login-SignIn">Sign In</h2>

          <input
            className="usernameInput"
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>

          <div className="input-container-forIcon">
            <input
              className={`passwordInput ${loginError ? 'error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(false);
              }}
            />
            <button onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
            </button>
          </div>

          {loginError && <div className="error-message-login">Incorrect username or password.</div>}

          <Link href="/" className="loginButton" onClick={handleLogin}>
              Log In
          </Link>

          <div className="forgot-password-container">
            <Link href="/forgotPassword" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
