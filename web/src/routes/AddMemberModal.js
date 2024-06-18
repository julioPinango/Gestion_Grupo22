import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function AddMemberModal({ isOpen, onClose, fetchGroup, groupId }) {
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

  const handleAddMembers = async (e) => {
    e.preventDefault();
    try {
      if (!groupId) {
        throw new Error("No se ha proporcionado el ID del grupo");
      }

      // Agregar miembros al grupo
      await Promise.all(
        members.map((member) => addMember(groupId, member))
      );

      setShowAlert(true);
      setAlertMessage(`Miembros agregados al grupo con éxito!`);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);

      onClose(); // Cerrar el modal después de agregar miembros
      setMembers([]);
      setMemberSuggestions([]);
    } catch (error) {
      console.error("Error adding members:", error.message);
      alert("Failed to add members: " + error.message);
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
      fetchGroup();
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
      id="addMemberModal"
      tabIndex="-1"
      aria-labelledby="addMemberModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addMemberModalLabel">
              Agregar Miembros al Grupo
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {showAlert && (
              <div className="alert alert-success" role="alert">
                {alertMessage}
              </div>
            )}
            <form onSubmit={handleAddMembers}>
              <div className="mb-3">
                <label htmlFor="groupMembers" className="form-label">
                  Buscar y seleccionar miembros para agregar al grupo
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
                Agregar Miembros
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchGroup: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired, // Propiedad requerida para el ID del grupo
};

export default AddMemberModal;
