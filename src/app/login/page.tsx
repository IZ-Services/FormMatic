"use client"
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../../firebase-config'

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = getAuth(app);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <main style={{display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
                <h1>Sign In</h1>

                <h5>Username</h5>

                <input 
                    placeholder="Your Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>

                <h5>Password</h5>

                <input 
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>

                <button style={{ display: "block", width: "100%"}}>Log In</button>
            </div>
        </main>
    );
}