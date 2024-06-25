'use client'
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { app } from '../firebase-config';
import "./account.css";

export default function Account() {
  const auth = getAuth(app);

  const [user, setUser] = useState(auth.currentUser);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');
  const [successfulAlertMessage, setSuccessfulAlertMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email ?? '');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleEditPasswordClick = () => {
    setEditPassword(!editPassword);
    setPasswordVisible(false);
    setErrorAlertMessage('');
    setSuccessfulAlertMessage('');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSaveNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorAlertMessage("New passwords do not match.");
      setSuccessfulAlertMessage('');
      return;
    }
    const credential = EmailAuthProvider.credential(user!.email!, currentPassword);
    try {
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, newPassword);
      setSuccessfulAlertMessage("Password updated successfully!");
      setErrorAlertMessage('');
      setEditPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Password update error:", error);
      setErrorAlertMessage('');
      setSuccessfulAlertMessage('');
    }
  };

  return (
    <div className="center-container">
      <div>
        <h1 className="login-SignIn">Account</h1>

        <div style={{ marginTop: "75px" }}>
          <input
            className="usernameInput"
            type="text"
            value={userEmail}
            readOnly
          />

          <div className="input-container-forIcon">
            <input
              className="passwordInput"
              type="password"
              placeholder="Password"
              value="********" // Placeholder as actual password cannot be displayed
              readOnly
            />
            <button className="toggle-password" onClick={handleEditPasswordClick}>
              <PencilSquareIcon className="input-icon" />
            </button>
          </div>

          {successfulAlertMessage && (
            <div className="alertMessage" style={{ marginTop: "20px", color: "gray" }}>
              {successfulAlertMessage}
            </div>
          )}

          {editPassword && (
            <div style={{ marginTop: "50px" }}>
              <div className="input-container-forIcon">
                <input
                  className="passwordInput"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  autoComplete='off'
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                <button className="toggle-password" onClick={togglePasswordVisibility}>
                  {passwordVisible ? <EyeSlashIcon className="input-icon" /> : <EyeIcon className="input-icon" />}
                </button>
              </div>

              <input
                className="passwordInput"
                type={passwordVisible ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                autoComplete='new-password'
                onChange={e => setNewPassword(e.target.value)}
                style={{ marginTop: "10px" }}
              />

              <input
                className="passwordInput"
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                autoComplete='new-password'
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ marginTop: "10px" }}
              />

              <button className="loginButton" onClick={handleSaveNewPassword} style={{ marginTop: "20px" }}>
                Save
              </button>

              {errorAlertMessage && (
                <div className="alertMessage" style={{ marginTop: "20px", color: "red" }}>
                  {errorAlertMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
