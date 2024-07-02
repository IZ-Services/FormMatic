'use client';
import React from 'react';
import { useState } from 'react';
import './login.css';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { emailSignIn } = UserAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleSignIn = async () => {
    try {
      if (emailSignIn) {
        await emailSignIn(email, password);
        router.push('/home');
      }
    } catch (error) {
      console.error('Error signing in: ', error);
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 3000);
    }
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
            placeholder="Email"
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
              {showPassword ? <EyeIcon className="icon" /> : <EyeSlashIcon className="icon" />}
            </button>
          </div>

          <div className={`errorLogin ${loginError ? 'visible' : ''}`}>
            Incorrect username or password.
          </div>
          <button className="loginButton" onClick={handleSignIn}>
            Log In
          </button>

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
