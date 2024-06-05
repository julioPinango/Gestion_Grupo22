import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UsersList";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./Home.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function EditTransaction() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const params = useParams();
console.log(params);
  const navigate = useNavigate(); // useNavigate hook from react-router-dom
  const token = localStorage.getItem("jwt-token");

  const editTransaction = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/transactions/${params.transaction_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      // Actualizar la lista de transacciones después de editar
    } catch (error) {
      
      console.error("Error editando la transacción:", error.message);
      alert("No se pudo editar la transacción: " + error.message);
    }
  };


  const handleEditTransaction = async (e) => {
    if (description === "") {
      alert("Campos incompletos");
      return;
    }

    e.preventDefault();
    await editTransaction();
  };

  return (
    <div className="Home text-center">
      <div>
        <Header href={`/groups/${params.id}`} />
      </div>
      <body>
        <form className="form" onSubmit={handleEditTransaction}>
          <h1>Editar Transacción</h1>

          

          <label htmlFor="">Nueva descripción</label>
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

export default EditTransaction;
