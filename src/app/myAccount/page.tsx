'use client';
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import './Account.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '../../components/pages/Loading';

export default function Account() {
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');
  const [successfulAlertMessage, setSuccessfulAlertMessage] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);
    }
  }, [user, isSubscribed, router]);

  if (loading) {
    return <Loading />;
  }

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
      setErrorAlertMessage('New passwords do not match.');
      setSuccessfulAlertMessage('');
      resetAlertMessages();
      return;
    }

    const credential = EmailAuthProvider.credential(user!.email!, currentPassword);
    try {
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, newPassword);
      setSuccessfulAlertMessage('Password updated successfully!');
      setErrorAlertMessage('');
      setEditPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/invalid-credential') {
          setErrorAlertMessage('Incorrect current password.');
        } else {
          console.error('Password update error:', error);
          setErrorAlertMessage('Failed to update password. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        setErrorAlertMessage('An unexpected error occurred. Please try again.');
      }
      setSuccessfulAlertMessage('');
    }
    resetAlertMessages();
  };

  const resetAlertMessages = () => {
    setTimeout(() => {
      setErrorAlertMessage('');
      setSuccessfulAlertMessage('');
    }, 3000);
  };

  return (
    <div className="accountContainer">
      <div className="accountContentWrapper">
        <h1 className="accountSignIn">Account Settings</h1>
        <div className="alertContainer">
          {successfulAlertMessage && (
            <div className="successfulAlertMessage">{successfulAlertMessage}</div>
          )}
          {errorAlertMessage && <div className="alertMessage">{errorAlertMessage}</div>}
        </div>
        <div>
          <input className="accountUsernameInput" type="text" value={user?.email || ''} readOnly />

          <div className="inputWithEditIcon">
            <input
              className="accountPasswordInput"
              type="password"
              placeholder="Password"
              value="********"
              readOnly
            />
            <PencilSquareIcon className="editAccountIcon" onClick={handleEditPasswordClick} />
          </div>
          {editPassword && (
            <div style={{ marginTop: '50px' }}>
              <div className="inputWithEyeIcon">
                <input
                  className="newPasswordInput"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Current Password"
                  value={currentPassword}
                  autoComplete="off"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {passwordVisible ? (
                  <EyeIcon className="eyeIcon" onClick={togglePasswordVisibility} />
                ) : (
                  <EyeSlashIcon className="eyeIcon" onClick={togglePasswordVisibility} />
                )}
              </div>

              <input
                className="newPasswordInput"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                autoComplete="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <input
                className="newPasswordInput"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <div className="saveButtonCont" style={{ marginTop: '20px' }}>
                <button className="saveBtn" onClick={handleSaveNewPassword}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
