import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { useParams } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const params = useParams();
  console.log("Este es el parametro: " + params.id)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  
  const addMember = async (member) => {
    try {
        await fetch(`http://localhost:3001/groups/${params.id}/members`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt-token')
            },
            body: JSON.stringify({
                username: member
            }),
        })
    .then( res => res)
    

    //if (!response.ok) {
      //      alert('Aca hay un error');
        //    const errorData = await response.json();
          //  throw new Error(errorData.message);
        //}
    
        //window.location.href = "/login";
    } catch (error) {
        console.error('Error creando el grupoooo:', error.message);
        alert('No se pudo crear el grupo: ' + error.message);
    }
};

  return (

    (
      <table class="table table-striped">
        <thead>
          <tr>
            <th class="table-dark" scope="col">#</th>
            <th class="table-dark" scope="col">Nombre</th>
            <th class="table-dark" scope="col">Apellido</th>
            <th class="table-dark" scope="col">Nombre de usuario</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user1, index) => (
            <tr>
              <th scope="row">{index}</th>
              <td>{user1.name}</td>
              <td>{user1.lastname}</td>
              <td>{user1.username}</td>
              <td>
                {/*<button
                  type="button"
                  class="btn btn-primary"
                  //onChange={() => setUsername(user1.username)}
                  onClick={()=>addMember(user1.username)}    
                >
                  Añadir
                </button>
          */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

export default UserList;
