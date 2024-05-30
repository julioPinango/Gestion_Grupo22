import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import GenericModal from "../components/GenericModal";

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
  const [payer, setPayer] = useState("");
  const params = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const navigate = useNavigate();

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

      // Mostrar la alerta
      setAlertMessage(
        `El usuario "${username}" ha sido eliminado del grupo con éxito!`
      );
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Error eliminando el participante:", error.message);
      alert("No se pudo eliminar el participante: " + error.message);
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
      // Mostrar la alerta
      setAlertMessage(
        `El usuario "${usuarioAAgregar}" ha sido agregado al grupo con éxito!`
      );
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
          body: JSON.stringify({ payer, amount, participants, description }),
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

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>

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

      <button
        type="button"
        className="btn btn-primary"
        onClick={openExpenseModal}
      >
        Agregar gasto
      </button>

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
        onClick={() =>  navigate('transactions')}
      >
        Ver transacciones
      </button>
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
                      onClick={() => openModal(user1)}
                    >
                      Eliminar participante
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAlert && (
        <div className="alert alert-danger" role="alert">
          {alertMessage}
        </div>
      )}

      {/*<GenericModal
        showModal={showModal}
        handleClose={closeModal}
        title="Eliminar miembro del grupo"
        bodyText={`¿Desea eliminar el miembro "${selectedMember?.username}" del grupo?`}
        confirmText="Eliminar"
        confirmAction={() => handleDelete(selectedMember?.username)}
        confirmButtonClass="btn-danger"
      />
    */}

      {/* Modal para asignar gasto */}
      <div
        className={`modal fade ${showExpenseModal ? "show" : ""}`}
        id="expenseModal"
        tabIndex="-1"
        aria-labelledby="expenseModalLabel"
        aria-hidden="true"
        style={{ display: showExpenseModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="expenseModalLabel">
                Agregar gasto
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeExpenseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddExpense}>
              <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    De parte de
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
                    Destinatarios
                  </label>
                  <div>
                    {users.map((user, index) => (
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
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Monto
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
                    Descripción
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
  );
};

export default Group;
