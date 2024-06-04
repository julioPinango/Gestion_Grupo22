import { useState } from "react";
import Button from "../components/Button";
import "./Login.css"; // Asegúrate de tener los estilos adecuados en este archivo
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
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
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (data.jwt !== null) {
        localStorage.setItem("jwt-token", data.jwt);
        window.location.href = "/groups";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="Login d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <form className="form" onSubmit={handleLogin}>
          <h1>Ingreso</h1>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button text="Ingresar" />
        </form>
      </div>
      <Footer />
    </div>
  );
}
