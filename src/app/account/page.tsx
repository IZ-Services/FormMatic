'use client'
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import app from '../../../firebase-config';

export default function Account() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [editPassword, setEditPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string>(user ? user.email ?? '' : '');

  useEffect(() => {
    if (user) {
      setUserEmail(user.email ?? '');
    }
  }, [user]);

  const handleEditPasswordClick = () => {
    setEditPassword(!editPassword);
    if (!editPassword) {
      setPasswordVisible(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSaveNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const credential = EmailAuthProvider.credential(user!.email!, currentPassword);
    try {
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, newPassword);
      alert("Password updated successfully!");
      setEditPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert((error as Error).message);
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

          {editPassword && (
            <div style={{ marginTop: "50px" }}>
              <div className="input-container-forIcon">
                <input
                  className="passwordInput"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
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
                onChange={e => setNewPassword(e.target.value)}
                style={{ marginTop: "10px" }}
              />

              <input
                className="passwordInput"
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ marginTop: "10px" }}
              />

              <button className="loginButton" onClick={handleSaveNewPassword} style={{ marginTop: "20px" }}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
