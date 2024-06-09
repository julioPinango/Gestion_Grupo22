import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import "./Group.css";

const Group = () => {
  const [users, setUsers] = useState([]);
  const [usuarioAAgregar, setUsuarioAAgregar] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [payer, setPayer] = useState("");
  const params = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchGroup();
  }, [params.id]);

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        }
      );

      const data = await response.json();
      setUsers(data.Groups);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/members/${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.username !== username)
      );
      setShowModal(false);

      setAlertMessage(`El usuario "${username}" ha sido eliminado del grupo con éxito!`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error eliminando el participante:", error.message);
    }
  };

  const addMember = async (member) => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({ username: member }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add member");
      }

      setAlertMessage(`El usuario "${usuarioAAgregar}" ha sido agregado al grupo con éxito!`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setUsuarioAAgregar("");
      fetchGroup();
    } catch (error) {
      setUsuarioAAgregar("");
      console.error("Error agregando el participante:", error.message);
      if (error.message === "Failed to add member") {
        alert("No se puede agregar un usuario inexistente");
      } else {
        alert("No se pudo agregar el participante: " + error.message);
      }
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({ payer, amount, participants, description, recurrence }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setShowExpenseModal(false);
      setAmount(0);
      setParticipants([]);
      setDescription("");
      setRecurrence("");
      fetchGroup();
    } catch (error) {
      console.error("Failed to add expense:", error.message);
      alert("Failed to add expense: " + error.message);
    }
  };

  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        const token = localStorage.getItem("jwt-token");

        const response = await fetch(
          `http://localhost:3001/groups/${params.id}/admin`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const adminUsername = responseData.admin;

          const decodedToken = decodeToken(token);

          if (decodedToken.username === adminUsername) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };

    checkIsAdmin();
  }, [params.id]);

  useEffect(() => {
    const getGroupInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/groups/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          let name =
            responseData.group.name.charAt(0).toUpperCase() +
            responseData.group.name.slice(1);
          setGroupName(name);
          setGroupDescription(responseData.group.description);
        }
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };

    getGroupInfo();
  }, [params.id]);

  const openModal = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setShowModal(false);
  };

  const openExpenseModal = () => {
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
  };

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const handleCheckboxChange = (username) => {
    setParticipants((prevParticipants) =>
      prevParticipants.includes(username)
        ? prevParticipants.filter((receiver) => receiver !== username)
        : [...prevParticipants, username]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`Group text-center ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="container mt-5">
        <h2>{groupName}</h2>
        <p>
          <span>
            {groupDescription}
            {isAdmin && (
              <a
                href={`/groups/${params.id}/edit`}
                style={{ padding: "0 10px" }}
              >
                <img src="/editar.png" width="20" height="20" alt="Editar" />
              </a>
            )}
          </span>
        </p>
      </div>

      <button type="button" className="btn btn-primary" onClick={openExpenseModal}>
        Agregar gasto
      </button>

      {isAdmin && (
        <button type="button" className="btn btn-primary" onClick={openAddUserModal}>
          Agregar usuario
        </button>
      )}

      <ul className="list-group mt-4">
        {users.length === 0 ? (
          <li className="list-group-item">Cargando usuarios...</li>
        ) : (
          users.map((user, index) => (
            <li key={index} className="list-group-item">
              {user.username}
              {isAdmin && (
                <button
                  type="button"
                  className="btn btn-danger float-right"
                  onClick={() => openModal(user)}
                >
                  Eliminar
                </button>
              )}
            </li>
          ))
        )}
      </ul>

      {showModal && (
        <div className="modal show">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro que deseas eliminar a {selectedMember.username}?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedMember.username)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="modal show">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Gasto</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={closeExpenseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddExpense}>
                  <div className="form-group">
                    <label htmlFor="amount">Monto:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recurrence">Recurrencia:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recurrence"
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="payer">Pagador:</label>
                    <select
                      className="form-control"
                      id="payer"
                      value={payer}
                      onChange={(e) => setPayer(e.target.value)}
                    >
                      <option value="">Selecciona un pagador</option>
                      {users.map((user, index) => (
                        <option key={index} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Participantes:</label>
                    {users.map((user, index) => (
                      <div key={index} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`participant-${index}`}
                          checked={participants.includes(user.username)}
                          onChange={() => handleCheckboxChange(user.username)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`participant-${index}`}
                        >
                          {user.username}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Agregar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="modal show">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Usuario</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={closeAddUserModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMember(usuarioAAgregar);
                    closeAddUserModal();
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="usuarioAAgregar">Nombre de usuario:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuarioAAgregar"
                      value={usuarioAAgregar}
                      onChange={(e) => setUsuarioAAgregar(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Agregar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="alert alert-success" role="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Group;
