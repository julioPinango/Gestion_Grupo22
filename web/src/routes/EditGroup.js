import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./Home.css";
import { Link } from "react-router-dom";

function EditGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const params = useParams();
  const navigate = useNavigate(); // useNavigate hook from react-router-dom
  const token = localStorage.getItem("jwt-token");

  const editGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Use Bearer token
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      navigate(`/groups/${params.id}`);
    } catch (error) {
      console.error("Error editando el grupo:", error.message);
      alert("No se pudo editar el grupo: " + error.message);
    }
  };

  return (
    <div className={`EditGroup ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container text-center mt-5">
        <form className="form" onSubmit={handleEditGroup}>
          <h1>Editar Grupo</h1>

          <label htmlFor="">Nuevo nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="">Nueva descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="container text-right mt-5 text-center">
            <Button text="Guardar cambios" />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditGroup;

