import React, { useState } from "react";
import PropTypes from "prop-types";

function CreateSavingGroupModal({ isOpen, onClose, onCreateGroupSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objetive, setObjetive] = useState(0);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt-token"),
        },
        body: JSON.stringify({
          name,
          description,
          objetive
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log("Group created:", data);
      onCreateGroupSuccess(); 
      onClose(); 
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating group:", error.message);
      alert("Failed to create group: " + error.message);
    }
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
            <form onSubmit={handleCreateGroup}>
              <div className="mb-3">
                <label>Nombre del grupo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Descripción</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">

              <label>Objetivo</label>
          <input
            type="number"
            value={objetive}
            onChange={(e) => setObjetive(e.target.value)}
          />
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

CreateSavingGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateGroupSuccess: PropTypes.func.isRequired,
};

export default CreateSavingGroupModal;
