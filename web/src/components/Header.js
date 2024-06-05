import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import lightmodenombre from "../img/lightmodenombre.png";
import darkmodeNombre from "../img/darkmodenombre.png";
import logo from "../img/LogoBillbuddy.png";

const Header = ({ toggleDarkMode, darkMode }) => {
  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
  };

  const token = localStorage.getItem("jwt-token");
  const location = useLocation();

  return (
    <header className="header py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to="/" className="text-light text-decoration-none logo-container d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <img src={darkMode ? darkmodeNombre : lightmodenombre} alt="Nombre del Proyecto" className="nombre-img ml-2" />
          </Link>
        </div>
        <nav className="nav nav-pills ml-auto d-flex align-items-center">
          {token ? (
            <>
              <Link
                to="/groups"
                className={`nav-item nav-link ${location.pathname === "/groups" ? "active" : ""}`}
              >
                Grupos
              </Link>
              <Link
                to="/transactions"
                className={`nav-item nav-link ${location.pathname === "/transactions" ? "active" : ""}`}
              >
                Transacciones
              </Link>
              <Link
                to="/deudas"
                className={`nav-item nav-link ${location.pathname === "/deudas" ? "active" : ""}`}
              >
                Deudas
              </Link>
              <Link
                to="/"
                onClick={handleLogout}
                className="nav-item nav-link"
              >
                <FontAwesomeIcon icon={faArrowRight} style={{ color: "white" }} />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-item nav-link ${location.pathname === "/login" ? "active" : ""}`}
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className={`nav-item nav-link ${location.pathname === "/register" ? "active" : ""}`}
              >
                Registrarme
              </Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="toggle-dark-mode-btn">
            {darkMode ? "Light Mode 🌞" : "Dark Mode 🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;



