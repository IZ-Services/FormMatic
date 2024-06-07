"use client"
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../globals.css";
import app from '../../../firebase-config'
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/solid'


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth(app);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push('/')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <main style={{display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
                <h1>FormMatic</h1>
                <h2>Sign In</h2>

                <div>
                    <UserIcon className='loginIcon'/>
                    <input
                        className='loginInput'
                        type="text"
                        placeholder="Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>

                <h5>Password</h5>

                <input 
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>

                <button style={{ display: "block", width: "100%"}} onClick={handleLogin}>Log In</button>
                <div style={{ marginTop: "10px" }}>
                    <a href="/forgot-password" style={{ textDecoration: "underline", color: "blue" }}>Forgot Password?</a>
                </div>
                
            </div>
        </main>
    );
}