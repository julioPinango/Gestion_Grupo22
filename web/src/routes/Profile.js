import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("jwt-token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${decodedToken.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await response.json();
        console.log(userData);
        setUser(userData.user);
        setName(userData.user.name);
        setLastname(userData.user.lastname);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formatDateOfBirth = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (!editMode) {
      setEditMode(true);
    } else {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${decodedToken.username}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              name,
              lastname,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        console.log(data);
        setEditMode(false);
      } catch (error) {
        console.error("Error editando el usuario:", error.message);
        alert("No se pudo editar el usuario: " + error.message);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedDarkMode) {
      setDarkMode(savedDarkMode);
      document.body.classList.add("dark-mode");
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <div className="container mt-4">
        <div className="profile-header">
          <h2>Perfil de Usuario</h2>
        </div>
        <form className="form-inline d-flex justify-content-center">
          <div className="col-auto align-items-center">
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Nombre</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editMode}
                style={{ height: "38px", verticalAlign: "middle", marginTop: 0 }}
              />
            </div>
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Apellido</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="lastname"
                placeholder="Apellido"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                disabled={!editMode}
                style={{ height: "38px", verticalAlign: "middle", marginTop: 0 }}
              />
            </div>
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Nombre de usuario</div>
              </div>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Nombre de usuario"
                defaultValue={user.username}
                disabled
                style={{ height: "38px", verticalAlign: "middle", marginTop: 0 }}
              />
            </div>
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <div className="input-group-text">Fecha de nacimiento</div>
              </div>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                placeholder="Fecha de nacimiento"
                value={formatDateOfBirth(user.date_of_birth)}
                disabled
                style={{ height: "38px", verticalAlign: "middle", marginTop: 0 }}
              />
            </div>
          </div>
              <button
                className="btn btn-primary"
                onClick={handleEditUser}
              >
                {editMode ? "Guardar cambios" : "Editar"}
                
              </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
