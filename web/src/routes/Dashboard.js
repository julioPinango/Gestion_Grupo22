import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import CreateGroupModal from "./CreateGroupModal";
import CreateSavingGroupModal from "./CreateSavingGroupModal";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();
  const location = useLocation();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreateSavingGroupModalOpen, setIsCreateSavingGroupModalOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:3001/groups", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt-token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data.Groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
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

  const handleCreateGroupModalOpen = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleCreateSavingGroupModalOpen = () => {
    setIsCreateSavingGroupModalOpen(true);
  };

  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalOpen(false);
    setIsCreateSavingGroupModalOpen(false);
  };

  const openExpenseModal = (groupId, initialName, initialDescription) => {
    setSelectedGroupId(groupId);
    setName(initialName);
    setDescription(initialDescription);
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
  };

  const handleEditGroup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/groups/${selectedGroupId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setShowExpenseModal(false);
      fetchGroups(); // Llamar de nuevo a fetchGroups después de editar el grupo
      // Opcional: Limpiar los estados de name y description después de editar
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to edit group:", error.message);
      alert("Failed to edit group: " + error.message);
    }
  };

  const handleCreateGroupSuccess = () => {
    fetchGroups();
  };

  return (
    <div className={`Dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mt-5">
        <h2 className="text-center">Welcome to BillBuddy</h2>
        <button className="btn btn-primary" onClick={handleCreateGroupModalOpen}>
            Crear grupo de gastos
          </button>
          <button className="btn btn-primary" onClick={handleCreateSavingGroupModalOpen}>
            Crear grupo de ahorros
          </button>
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
                      <button onClick={() => openExpenseModal(group.id, group.name, group.description)} className="btn btn-secondary">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        Editar
                      </button>
                      <button onClick={() => navigate(`${group.id}`)} className="btn btn-primary">
                        <FontAwesomeIcon icon={faEye} />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>

  

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
                Editar grupo
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeExpenseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditGroup}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre del grupo:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      

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
                Editar grupo
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeExpenseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditGroup}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre del grupo:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={handleCreateGroupModalClose} onCreateGroupSuccess={handleCreateGroupSuccess} />
      <CreateSavingGroupModal isOpen={isCreateSavingGroupModalOpen} onClose={handleCreateGroupModalClose} onCreateGroupSuccess={handleCreateGroupSuccess} />
      <Footer />
    </div>
  );
}

export default Dashboard;

