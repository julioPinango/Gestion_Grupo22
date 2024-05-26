import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from 'react-router-dom';
import Header from "../components/Header";
import { decodeToken } from "react-jwt";

const Group = () => {
  const [users, setUsers] = useState([]);
  const [usuarioAAgregar, setUsuarioAAgregar] = useState("");
  const params = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  
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



  useEffect(() => {

    const checkIsAdmin = async () => {
      try {
        const token = localStorage.getItem("jwt-token");


        const response = await fetch(`http://localhost:3001/groups/${params.id}/admin`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }});
        
        if (response.ok) {
          const responseData = await response.json();
          const adminUsername = responseData.admin;
          
          const decodedToken = decodeToken(token);
          

          if (decodedToken.username === adminUsername){
            setIsAdmin(true);
          }
        }
       
        
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    checkIsAdmin();
  }, []);


  useEffect(() => {

    const getGroupInfo = async () => {
      try {

        const response = await fetch(`http://localhost:3001/groups/${params.id}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("jwt-token")
        }});
        
        if (response.ok) {

          const responseData = await response.json();
          let name = responseData.group.name.charAt(0).toUpperCase() + responseData.group.name.slice(1);
          setGroupName(name);
          setGroupDescription(responseData.group.description);
        }
       
        
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    getGroupInfo();
  }, []);




  return (
    <div className="text-center"> {/* Center the content */}
      <div>
        <Header href="/groups" />
      </div>

      <div class="container mt-5">
        <h2>{groupName}</h2>
        <p> 
          <span>
            {groupDescription} 
            {isAdmin && (
                  <a href={`/groups/${params.id}/edit`} style={{ padding: '0 10px' }}>
                      <img src="/editar.png" width="20" height="20" alt="Editar"/>
                  </a>
              )}
          </span>
        </p>
        
      </div>

      
      <div class="container mt-5">
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
      </div>
      <div className="table-responsive mt-5">
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
                  {isAdmin && ( 
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteMember(user1.username)}
                    >
                      Eliminar participante
                    </button>              
                  )}

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
