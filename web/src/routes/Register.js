import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Register.css"; 

export default function Register() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          lastname,
          username,
          email,
          password,
          date_of_birth : date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      window.location.href = "/groups";

    } catch (error) {
      console.error('Error creating user:', error.message);
      alert('Register failed: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    if (name === '' || lastname === '' || username === '') {
      alert('Campos incompletos');
      return;
    }

    e.preventDefault();
    await createUser();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`Register d-flex flex-column min-vh-100 ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <form className="form" onSubmit={handleRegister}>
          <h1>Registro</h1>

          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
          />

          <label htmlFor="">Apellido</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(capitalizeFirstLetter(e.target.value))}
          />

          <label htmlFor="">Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="">Fecha de Nacimiento</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button text="Registrarme" />
        </form>
      </div>
      <Footer />
    </div>
  );
}
