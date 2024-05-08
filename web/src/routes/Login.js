import React, { useState } from "react";
import './Home.css';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'


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
                const errorData = await response.json();
                throw new Error(errorData.message);
            }     
            
            window.location.href = "/dashboard";

        } catch (error) {
            console.error('Login failed:', error.message);
            alert('Login failed: ' + error.message);
        }
        
    };


    return (
        <div className="Home"> 
            <div>
                <Header/>
            </div>
            <body>
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

                    
                    <Button text="Ingresar"/>

                </form>
            </body>
            <div>
                <Footer/>
            </div>
        </div>
    )
};