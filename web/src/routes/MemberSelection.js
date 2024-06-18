import React, { useState } from "react";
import PropTypes from "prop-types";

function MemberSelection({ onSelectMember }) {
  const [searchUser, setSearchUser] = useState("");
  const [memberSuggestions, setMemberSuggestions] = useState([]);

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
    onSelectMember(selectedMember); // Llamar a la función del padre con el usuario seleccionado
    setSearchUser(""); // Limpiar el campo de búsqueda después de seleccionar
    setMemberSuggestions([]); // Limpiar las sugerencias
  };

  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar y seleccionar miembros"
        value={searchUser}
        onChange={handleSearchUser}
      />
      {memberSuggestions.length > 0 && (
        <ul className="list-group mt-2">
          {memberSuggestions.map((user, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectMember(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

MemberSelection.propTypes = {
  onSelectMember: PropTypes.func.isRequired,
};

export default MemberSelection;


