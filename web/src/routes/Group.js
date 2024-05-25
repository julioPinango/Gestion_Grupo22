import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
import Header from "../components/Header";

const Group = () => {
  const [users, setUsers] = useState([]);
  const [usuarioAAgregar, setUsuarioAAgregar] = useState("");
  const params = useParams();
  
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`http://localhost:3001/groups/${params.id}/members`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt-token')
          }
        });
        
        const data = await response.json();
        setUsers(data.Groups);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchGroup();
  }, [params.id]);
  const navigate = useNavigate();

  


  const deleteMember = async (member) => {
    try {
      const response = await fetch(`http://localhost:3001/groups/${params.id}/members/${member}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('jwt-token')
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      // Update the state to remove the deleted member
      setUsers((prevUsers) => prevUsers.filter(user => user.username !== member));
    } catch (error) {
      console.error('Error eliminando el participante:', error.message);
      alert('No se pudo eliminar el participante: ' + error.message);
    }
  };

  const addMember = async (member) => {
    try {
      const response = await fetch(`http://localhost:3001/groups/${params.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('jwt-token')
        },
        body: JSON.stringify({ username: member })
      });

      if (!response.ok) {
        throw new Error("Failed to add member");
      }

      const newUser = await response.json();

      // Update the state to include the new member
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setUsuarioAAgregar("");  // Clear the input field
    } catch (error) {
      setUsuarioAAgregar("");
      console.error('Error agregando el participante:', error.message);
      if (error.message === 'Failed to add member') {
        alert('No se puede agregar un usuario inexistente');
      } else {
        alert('No se pudo agregar el participante: ' + error.message);
      }
    }
  };

  return (
    <div className="text-center"> {/* Center the content */}
    <div>
        <Header href="/groups" />
      </div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="add-user">Usuario a agregar</label>
        <input
          type="text"
          id="add-user"
          value={usuarioAAgregar}
          onChange={(e) => setUsuarioAAgregar(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => addMember(usuarioAAgregar)}
        >
          Agregar participante
        </button>
      </form>
      <div className="table-responsive">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Nombre de usuario</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user1, index) => (
            <tr key={index}>
              <th scope="row">{index}</th>
              <td>{user1.name}</td>
              <td>{user1.lastname}</td>
              <td>{user1.username}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteMember(user1.username)}
                >
                  Eliminar participante
                </button>
                <Link to={`/groups/${params.id}/add-expense`}>

                <button
                  type="button"
                  className="btn btn-primary"
                  >
                  Asignar gasto
                </button>
                  </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Group;
