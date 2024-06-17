import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./CreateGroup.css";

function CreateSavingGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objetive, setObjetive] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt-token");

  const createGroup = async () => {
    try {
      const response = await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name,
          description,
          objetive
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      navigate('/groups');
    } catch (error) {
      console.error("Error creando el grupo:", error.message);
      alert("No se pudo crear el grupo: " + error.message);
    }
  };

  const handleCreateGroup = async (e) => {
    if (name === "" || description === "") {
      alert("Campos incompletos");
      return;
    }

    e.preventDefault();
    await createGroup();
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <div className={`CreateGroup ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mt-5">
        <form className="form" onSubmit={handleCreateGroup}>
          <h1>Creación de Grupo</h1>
          <label>Nombre del grupo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Descripcion</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Objetivo</label>
          <input
            type="number"
            value={objetive}
            onChange={(e) => setObjetive(e.target.value)}
          />
          <div className="text-center mt-5">
            <Button text="Crear grupo" />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default CreateSavingGroup;