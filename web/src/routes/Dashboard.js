import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Link } from "react-router-dom";
function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
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
    <div className={`Dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mt-5">
        <h2 className="text-center">Welcome to BillBuddy</h2>
        <h3 className="text-center mt-5">Mis grupos</h3>
        <div className="container text-left">
          <table className="table table-dark table table-striped table-bordered table-responsive" id="tabla">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {groups.map((group, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{group.name}</td>
                  <td>{group.description}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button onClick={() => navigate(`${group.id}`)} className="btn btn-primary">
                        Ver grupo
                      </button>
                      {/*<button onClick={() => navigate(`add/${group.id}`)} className="btn btn-warning">
                        Añadir participantes
                      </button>*/}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/*
          <div className="d-flex justify-content-end mt-5">
            <a href="/group/create" className="btn btn-primary">
              Crear grupo
            </a>
          </div>
            */}
          <Link
                to="/group/create"
                className={'btn btn-primary'}
              >
                Crear grupo de gastos
              </Link>
          <Link
                to="/groups/savinggroup"
                className={'btn btn-primary'}
              >
                Crear grupo de ahorro
              </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;

