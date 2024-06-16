import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import GenericModal from "../components/GenericModal";
import Calendar from "react-calendar"; 
import { Link, useLocation } from "react-router-dom";
import "./Group.css";

const Group = () => {
  const [users, setUsers] = useState([]);
  const [usuarioAAgregar, setUsuarioAAgregar] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(1);
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [objetive, setObjetive] = useState(null);
  const [isCollaboration, setIsCollaboration] = useState(false);
  
  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate);
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

  const formatDate = (date) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getCurrentDate());

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

  const handleAddSaving = async (e) => {
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
          body: JSON.stringify({ payer, amount, description}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setShowExpenseModal(false);
      setAmount(0);
      fetchGroup();
    } catch (error) {
      console.error("Failed to add expense:", error.message);
      alert("Failed to add expense: " + error.message);
    }
  };
  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      console.log("Dia formateado:", selectedDate);
      let newDate = new Date(selectedDate);
      if (recurrence === "Semanal") {
        newDate.setDate(newDate.getDate() + 7);
      } else if (recurrence === "Mensual") {
        newDate.setMonth(newDate.getMonth() + 1);
      }

      const formattedDate = newDate.toISOString();
      console.log("Dia formateado:", formattedDate);

      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({ payer, amount, participants, description, recurrence, selectedDate: formattedDate, category }),
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
          let name = responseData.group.name.charAt(0).toUpperCase() + responseData.group.name.slice(1);
          setGroupName(name);
          setGroupDescription(responseData.group.description);
          setObjetive(responseData.group.objetive);
          
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
    setIsCollaboration(objetive !== null && objetive > 0);
    if (objetive !== null && objetive > 0) {
      setPayer(getLoggedUser());
    }
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

  const [userBalance, setUserBalance] = useState(0);
  useEffect(() => {
    const getBalance = async () => {
      try {

        const token = localStorage.getItem("jwt-token");

        const response = await fetch(
          `http://localhost:3001/groups/${params.id}/balances`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const decodedToken = decodeToken(token);
          setUserBalance(data.Balances.find(user => user.username === decodedToken.username).balance);
        }
        
      } catch (error) {
        console.error("Error fetching user balance info:", error);
      }
    };

    getBalance();
  }, [params.id]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const getLoggedUser = () => {
    const token = localStorage.getItem("jwt-token");

    if (token) {
      try {
        const decodedToken = decodeToken(token);
        return decodedToken.username; // Suponiendo que el token contiene el nombre de usuario como parte de los datos
      } catch (error) {
        console.error("Error decoding token:", error);
        return null; // Manejar el error según sea necesario
      }
    } else {
      return null; // Manejar el caso en el que no haya token almacenado (usuario no autenticado)
    }
  };

  const loggedUser = getLoggedUser();
  return (
    <div className={`Group ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div className="container mt-5 mb-5">
      <h2>{groupName}</h2>
      <p>
        <span>
          {groupDescription}
          {isAdmin && (
            <Link to={`/groups/${params.id}/edit`} style={{ padding: "0 10px" }}>
              <img src="/editar.png" width="20" height="20" alt="Editar" />
            </Link>
          )}
          <div class="container mt-3">
            <div class="row justify-content-center">
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-left">
                    Saldo: {userBalance}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </span>
      </p>
    </div>

        <div className="button-group">
        {objetive !== null && objetive > 0 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={openExpenseModal}
          >
            Colaborar 
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={openExpenseModal}
          >
            Agregar gasto
          </button>
        )}

  {isAdmin && (
    <button
      type="button"
      className="btn btn-primary"
      onClick={openAddUserModal}
    >
      Agregar miembro
    </button>
  )}
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => navigate('transactions')}
  >
    Ver transacciones
  </button>
</div>

      <p></p>
      <div className="table table-dark table-striped table-responsive">
        <table className="table table-dark table-striped table-bordered">
          <thead>
            <tr>
              <th class="table-dark" scope="col">#</th>
              <th class="table-dark" scope="col">Nombre</th>
              <th class="table-dark" scope="col">Apellido</th>
              <th class="table-dark" scope="col">Nombre de usuario</th>
              <th class="table-dark" scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            {users ? users.map((user1, index) => (
              <tr class="table-primary table-bordered" key={index}>
                <th scope="row">{index}</th>
                <td>{user1.name}</td>
                <td>{user1.lastname}</td>
                <td>{user1.username}</td>
                <td>
                  {isAdmin && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(user1.username)}
                    >
                      🗑️ Eliminar participante
                    </button>
                  )}
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {showAlert && (
        <div className={`alert ${selectedMember ? 'alert-danger' : 'alert-success'}`} role="alert">
          {alertMessage}
        </div>
      )}
       <div
        className={`modal fade ${showExpenseModal ? "show" : ""}`}
        id="expenseModal"
        tabIndex="-1"
        aria-labelledby="expenseModalLabel"
        aria-hidden="true"
        style={{ display: showExpenseModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="expenseModalLabel">
              {isCollaboration ? "Colaborar" : "Agregar gasto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeExpenseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <form onSubmit={isCollaboration ? handleAddSaving : handleAddExpense}>
                {isCollaboration ? (
                  <>
                  <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    De parte de:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="amount"
                    value={payer}
                    readOnly
                    onChange={(e) => setPayer(e.target.value)}
                  />
                </div>
                  <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Monto:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción:
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Agregar
                </button>
                    </>
  ):(
<>
                  <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    De parte de:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="amount"
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="participants" className="form-label">
                    Destinatarios:
                  </label>
                  <div>
                    {users ? users.map((user, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={user.username}
                          id={`checkbox-${index}`}
                          checked={participants.includes(user.username)}
                          onChange={() => handleCheckboxChange(user.username)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${index}`}
                        >
                          {user.username}
                        </label>
                      </div>
                    )) : null}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Monto:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción:
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
      <label htmlFor="selectedDate" className="form-label">
        {calendarVisible ? formatDate(selectedDate) : "Seleccionar fecha"}
      </label>
      <div>
        <button type="button" onClick={toggleCalendar}>
          {calendarVisible ? "Ocultar calendario" : formatDate(selectedDate)}
        </button>
        {calendarVisible && (
          <Calendar
            id="selectedDate"
            onChange={setSelectedDate}
            value={selectedDate}
          />
        )}
      </div>
    </div>
                <div className="mb-3">
                  <label htmlFor="recurrence" className="form-label">
                    Recurrencia:
                  </label>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="recurrence-once"
                        value="once"
                        checked={recurrence === "Única vez"}
                        onChange={() => setRecurrence("Única vez")}
                      />
                      <label className="form-check-label" htmlFor="recurrence-once">
                        Única vez
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="recurrence-weekly"
                        value="weekly"
                        checked={recurrence === "Semanal"}
                        onChange={() => setRecurrence("Semanal")}
                      />
                      <label className="form-check-label" htmlFor="recurrence-weekly">
                        Semanal
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="recurrence-monthly"
                        value="monthly"
                        checked={recurrence === "Mensual"}
                        onChange={() => setRecurrence("Mensual")}
                      />
                      <label className="form-check-label" htmlFor="recurrence-monthly">
                        Mensual
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Categoría
            </label>
            <select
              className="form-select"
              id="category"
              value={category}
              onChange={(e) => setCategory(parseInt(e.target.value))}
              >
              <option value={1}>Gasto general</option>
              <option value={2}>Recreación</option>
              <option value={3}>Servicio</option>
              <option value={4}>Transporte</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
                <button type="submit" className="btn btn-primary">
                  Agregar
                </button>
            </>
            )}
              </form>
            </div>
          </div>
        </div>
      </div>


      <div
        className={`modal fade ${showAddUserModal ? "show" : ""}`}
        id="addUserModal"
        tabIndex="-1"
        aria-labelledby="addUserModalLabel"
        aria-hidden={!showAddUserModal}
        style={{ display: showAddUserModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">
                Agregar usuario al grupo
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeAddUserModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="add-user" className="form-label">
                    Usuario a agregar
                  </label>
                  <input
                    type="text"
                    id="add-user"
                    className="form-control"
                    value={usuarioAAgregar}
                    onChange={(e) => setUsuarioAAgregar(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    addMember(usuarioAAgregar);
                    closeAddUserModal();
                  }}
                >
                  Agregar al grupo
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Group;
