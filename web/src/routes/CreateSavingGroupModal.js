import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CreateSavingGroupModal({ isOpen, onClose, onCreateGroupSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objetive, setObjetive] = useState(0);
  const [members, setMembers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Lógica para cargar todos los usuarios disponibles al inicio
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // No establecemos las sugerencias al inicio para que comience vacío
        // setMemberSuggestions(data.users); 
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchAllUsers();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      // Crear el grupo primero
      const groupResponse = await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt-token"),
        },
        body: JSON.stringify({
          name,
          description,
          objetive,
        }),
      });

      const groupData = await groupResponse.json();

      if (!groupResponse.ok) {
        throw new Error(groupData.message);
      }

      console.log("Group created:", groupData);

      // Luego, agregar miembros al grupo si se especifican
      await Promise.all(
        members.map((member) => addMember(groupData.groupId, member))
      );

      setShowAlert(true);
      setAlertMessage(`Grupo "${name}" creado con éxito!`);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);

      onCreateGroupSuccess(); // Actualizar la lista de grupos en el componente padre
      onClose(); // Cerrar el modal después de crear el grupo
      setName("");
      setDescription("");
      setObjetive(0);
      setMembers([]);
      setMemberSuggestions([]);
    } catch (error) {
      console.error("Error creating group:", error.message);
      alert("Failed to create group: " + error.message);
    }
  };

  const addMember = async (groupId, username) => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${groupId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(`Member "${username}" added to group ${groupId} successfully`);
    } catch (error) {
      console.error("Error adding member:", error.message);
      alert("Failed to add member: " + error.message);
    }
  };

  const handleSearchUser = async (e) => {
    setSearchUser(e.target.value);
    try {
      // Solo realizar la búsqueda si el campo de búsqueda tiene contenido
      if (e.target.value.trim() !== "") {
        const response = await fetch(
          `http://localhost:3001/users?q=${e.target.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user suggestions");
        }
        const data = await response.json();
        setMemberSuggestions(data.users); // Actualizar sugerencias basadas en la búsqueda
      } else {
        // Si el campo de búsqueda está vacío, limpiar las sugerencias
        setMemberSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching user suggestions:", error.message);
    }
  };

  const handleSelectMember = (selectedMember) => {
    if (!members.includes(selectedMember.username)) {
      setMembers([...members, selectedMember.username]);
    }
    setSearchUser(""); // Limpiar el campo de búsqueda después de seleccionar
    setMemberSuggestions([]); // Limpiar las sugerencias
  };

  const handleRemoveMember = (memberToRemove) => {
    const updatedMembers = members.filter((member) => member !== memberToRemove);
    setMembers(updatedMembers);
  };

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      id="createGroupModal"
      tabIndex="-1"
      aria-labelledby="createGroupModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createGroupModalLabel">
              Crear grupo
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {showAlert && (
              <div className="alert alert-success" role="alert">
                {alertMessage}
              </div>
            )}
            <form onSubmit={handleCreateGroup}>
              <div className="mb-3">
                <label htmlFor="groupName" className="form-label">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="groupDescription" className="form-label">
                  Descripción
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="groupObjetive" className="form-label">
                  Objetivo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="groupObjetive"
                  value={objetive}
                  onChange={(e) => setObjetive(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="groupMembers" className="form-label">
                  Agregar miembros (buscar por nombre de usuario)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupMembers"
                  value={searchUser}
                  onChange={handleSearchUser}
                />
                {memberSuggestions.length > 0 && (
                  <ul className="list-group mt-2">
                    {memberSuggestions.map((member, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectMember(member)}
                      >
                        {member.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {members.length > 0 && (
                <div className="mb-3">
                  <strong>Miembros seleccionados:</strong>
                  <ul className="list-group mt-2">
                    {members.map((member, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {member}
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveMember(member)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                Crear
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CreateSavingGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateGroupSuccess: PropTypes.func.isRequired,
};

export default CreateSavingGroupModal;


