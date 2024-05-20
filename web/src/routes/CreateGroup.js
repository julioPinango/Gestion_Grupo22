import { useState, useEffect } from "react";
import UserList from "../components/UsersList";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./Home.css";

function CreateGroup() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("jwt-token");

  const [members, setMembers] = useState([]);

  const createGroup = async () => {
    try {
      await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt-token"),
        },
        body: JSON.stringify({
          name,
          description,
          members,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          let inMemoryToken = res.jwt;
          console.log(inMemoryToken);
          // { Authorization: `Bearer  ${ inMemoryToken }`; }
          return inMemoryToken;
        });

      //if (!response.ok) {
      //      alert('Aca hay un error');
      //    const errorData = await response.json();
      //  throw new Error(errorData.message);
      //}

      //window.location.href = "/login";
      console.log("Este es el token: " + token);
    } catch (error) {
      console.error("Error creando el grupoooo:", error.message);
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

  return (
    <div className="Home">
      {" "}
      {}
      <div>
        <Header href="/dashboard" />
      </div>
      <body>
        <form className="form" onSubmit={handleCreateGroup}>
          <h1>Creación de Grupo</h1>

          <label htmlFor="">Nombre del grupo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="sr-only">Descripcion</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="sr-only">Usuarios añadidos</label>
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />

          <label className="sr-only">Balance</label>
          <input
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <div className="container text-right mt-5">
            <Button text="Crear grupo" />
          </div>
        </form>
      </body>
      <div></div>
    </div>
  );
}

export default CreateGroup;
