import { useState } from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'


export default function Register () {

    const[name, setName] = useState("");
    const[lastname, setLastname] = useState("");
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[date, setDate] = useState("");



    const createUser = async () => {
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({
                    name,
                    lastname,
                    username,
                    email,
                    password,
                    date
                }),
            });
        
            if (!response.ok) {
              throw new Error('Failed to create user');
            }
        
            const responseData = await response.json();
            console.log('User created successfully:', responseData);    
        
        } catch (error) {
            console.error('Error creating user:', error.message);
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault(); 
        await createUser(); 
    };

    return (
        <div className="Home"> 
            <div>
                <Header/>
            </div>
            <body>
                <form className="form" onSubmit={handleRegister}>
                    <h1>Registro</h1>

                    <label>Nombre</label>
                    <input type="text"
                    value={name} 
                    onChange={(e)=> setName(e.target.value)} />

                    <label htmlFor="">Apellido</label>
                    <input 
                    type="text"
                    value={lastname} 
                    onChange={(e)=> setLastname(e.target.value)} />

                    <label htmlFor="">Nombre de usuario</label>
                    <input 
                    type="text"
                    value={username} 
                    onChange={(e)=> setUsername(e.target.value)} />

                    <label htmlFor="">Email</label>
                    <input 
                    type="email"
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)} />

                    <label htmlFor="">Contraseña</label>
                    <input 
                    type="password"
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)} />

                    <label htmlFor="">Fecha de Nacimiento</label>
                    <input 
                    type="date"
                    value={date} 
                    onChange={(e)=> setDate(e.target.value)} />

                    <button type="submit" className="button">Registrarme</button>

                    </form>
            </body>
            <div>
                <Footer/>
            </div>
        </div>
    )
    
};