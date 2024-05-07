import React, { useState } from "react";
import './Home.css';

export default function Login () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            });   

            if (!response.ok) {
                throw new Error("Failed to login");
            }     
            
            const data = await response.json();
            localStorage.setItem("token", data.jwt);
    
            window.location.href = "/dashboard";

        } catch (error) {
          console.error("Error logging in:", error.message);
        }
    };


    return (
        <div className="Home"> 
            <header className="header"> 
                <h1 className="title">BillBuddy</h1>
            </header>
            <main>
                <form className="form" onSubmit={handleLogin}>
                    <h1>Ingreso</h1>

                    <label htmlFor="">Email</label>
                    <input 
                    type="email" 
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)}/>

                    <label htmlFor="">Contraseña</label>
                    <input 
                    type="password" 
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)} />

                    <button type="submit" className="button">Ingresar</button>
                </form>
            </main>
            <footer className="footer"> 
                <p>BillBuddy 2024</p>
            </footer>
        </div>
    )
};