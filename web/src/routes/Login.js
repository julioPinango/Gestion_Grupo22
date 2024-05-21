import { useState } from "react";
import Button from "../components/Button";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.jwt !== null) {
            localStorage.setItem("jwt-token", data.jwt);
            console.log(data.jwt);
            //setEmail('')
            //setPassword('')
            //router.push('/jwt-safehouse')
          } else {
            alert(data.message);
            console.log("esta es la data: " + data);
          }
        });

      window.location.href = "/groups";
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };
  return (
    <div className="Home">
      <div>
        <Header href="/" />
      </div>
      <body>
        <form className="form" onSubmit={handleLogin}>
          <h1>Ingreso</h1>

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

          <Button text="Ingresar" />
        </form>
      </body>
      <div>
        <Footer />
      </div>
    </div>
  );
}
