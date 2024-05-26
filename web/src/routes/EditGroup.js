import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UsersList";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./Home.css";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

function EditGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const params = useParams();

  const navigate = useNavigate(); // useNavigate hook from react-router-dom
  const token = localStorage.getItem("jwt-token");

  const editGroup = async () => {
    try {
      const response = await fetch(`http://localhost:3001/groups/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Use Bearer token
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      //const groupId = data.groupId; //

      // Redirect to the group page
      navigate(`/groups/${params.id}`);
    } catch (error) {
      console.error("Error editando el grupo:", error.message);
      alert("No se pudo editar el grupo: " + error.message);
    }
  };

  const handleEditGroup = async (e) => {
    if (name === "" || description === "") {
      alert("Campos incompletos");
      return;
    }

    e.preventDefault();
    await editGroup();
  };

  return (
    <div className="Home text-center">
      <div>
        <Header href={`/groups/${params.id}`} />
      </div>
      <body>
        <form className="form" onSubmit={handleEditGroup}>
          <h1>Editar Grupo</h1>

          <label htmlFor="">Nuevo nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="sr-only">Actualizar descripcion</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/*<label className="sr-only">Usuarios añadidos</label>
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value.split(","))} // Assuming members are input as comma-separated values
          />

          <label className="sr-only">Balance</label>
          <input
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
  */}
          <div className="container text-right mt-5 text-center">
            <Button text="Guardar cambios" />
          </div>
          
        </form>
      </body>
      <div></div>
    </div>
  );
}

export default EditGroup;
