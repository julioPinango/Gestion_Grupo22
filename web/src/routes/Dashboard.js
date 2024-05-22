import React from "react";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:3001/groups", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setGroups(data.Groups);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="Home">
      {" "}
      {}
      <div>
        <Header href="/dashboard" />
      </div>
      <body className="container mt-5">
        <h2 className="body text-center">Welcome to BillBuddy</h2>
        <h3 className="body text-center mt-5">Mis grupos</h3>

        <div class="container text-left">
          <table class="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr>
                  <th scope="row">{index}</th>
                  <td>{group.name}</td>
                  <td>{group.description}</td>
                  <td>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <div class="btn-group">
                      <button onClick={() =>  navigate(`${group.id}`)} class="btn btn-primary">
                          Ver grupo
                        </button>
                        {/*<button onClick={() =>  navigate(`add/${group.id}`)} class="btn btn-warning">
                          Añadir participantes
              </button>*/}
                      </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-end mt-5">
            <a href="/group/create" class="btn btn-primary">
              Crear grupo
            </a>
          </div>
        </div>
      </body>
   
    </div>
  );
}

export default Dashboard;
