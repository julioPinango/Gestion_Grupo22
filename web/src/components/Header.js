import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarDays } from "@fortawesome/free-solid-svg-icons"; // Importar faCalendarDays

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
  };

  const token = localStorage.getItem("jwt-token");
  const location = useLocation();

  return (
    <header className="bg-dark text-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">
            <Link to="/" className="text-light text-decoration-none">
              BillBuddy
            </Link>
          </h1>
          {token ? (
            <nav className="nav nav-pills">
              <div>
                <Link
                  to="/recordatorios"
                className={`nav-item nav-link ${
                  location.pathname === "/recordatorios" ? "active" : ""
                }`}
                >
                  <FontAwesomeIcon icon={faCalendarDays} /> {/* Utilizar el icono del calendario */}
                </Link>
              </div>
              <Link
                to="/groups"
                className={`nav-item nav-link ${
                  location.pathname === "/groups" ? "active" : ""
                }`}
              >
                Grupos
              </Link>
              <Link
                to="/transactions"
                className={`nav-item nav-link ${
                  location.pathname === "/transactions" ? "active" : ""
                }`}
              >
                Transacciones
              </Link>
              <Link
                to="/deudas"
                className={`nav-item nav-link ${
                  location.pathname === "/deudas" ? "active" : ""
                }`}
              >
                Deudas
              </Link>
              <div>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className={`nav-item nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ color: "white" }}
                  />
                </Link>
              </div>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
