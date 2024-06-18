import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CreateGroupModal({ isOpen, onClose, onCreateGroupSuccess }) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
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
          name: groupName,
          description,
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
      setAlertMessage(`Grupo "${groupName}" creado con éxito!`);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);

      onCreateGroupSuccess(); // Actualizar la lista de grupos en el componente padre
      onClose(); // Cerrar el modal después de crear el grupo
      setGroupName("");
      setDescription("");
      setMembers([]);
      setMemberSuggestions([]);
    } catch (error) {
      console.error("Error creating group:", error.message);
      alert("Failed to create group: " + error.message);
    }
  };

  const addMember = async (groupId, member) => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${groupId}/members`,
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

      console.log(`Member "${member}" added to group ${groupId} successfully`);
    } catch (error) {
      console.error("Error adding member:", error.message);
      if (error.message === "Failed to add member") {
        alert("No se puede agregar un usuario inexistente");
      } else {
        alert("No se pudo agregar el participante: " + error.message);
      }
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
    if (!members.includes(selectedMember)) {
      setMembers([...members, selectedMember]);
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
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
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
                />
              </div>
              <div className="mb-3">
                <label htmlFor="groupMembers" className="form-label">
                  Agregar miembros (separados por coma)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupMembers"
                  value={searchUser} // Usamos 'searchUser' para la búsqueda de usuarios
                  onChange={handleSearchUser}
                />
                {memberSuggestions.length > 0 && (
                  <ul className="list-group mt-2">
                    {memberSuggestions.map((member, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectMember(member.username)}
                      >
                        {member.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
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
              </div>
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

CreateGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateGroupSuccess: PropTypes.func.isRequired,
};

export default CreateGroupModal;
