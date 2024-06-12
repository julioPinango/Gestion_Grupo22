import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faCalendarDays, faUser, faBell, faChartSimple } from "@fortawesome/free-solid-svg-icons";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3001/notifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(prevNotifications => [...prevNotifications, ...data.Notifications]);

      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

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
                to="/profile"
                className={`nav-item nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <Link
                to="/recordatorios"
                className={`nav-item nav-link ${location.pathname === "/recordatorios" ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faCalendarDays} />
              </Link>
              <Link
                to="/charts"
                className={`nav-item nav-link ${location.pathname === "/charts" ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faChartSimple} />
              </Link>
              <div className="nav-item nav-link notification-container">
                <div
                  className={`notification-icon notifications-text ${showNotifications ? "active" : ""}`}
                  onClick={() => {
                    setShowNotifications(prevShowNotifications => !prevShowNotifications);
                    if (showNotifications) {
                      setNotifications([]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faBell} className={darkMode ? "dark-mode-icon" : ""} />
                  {notifications.length !== 0 && (
                    <span className="notification-badge">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  )}
                </div>
                {showNotifications && (
                  <div className="popover" style={{ display: 'block' }}>
                    <div className="arrow"></div>
                    <h3 className="popover-header">Notifications</h3>
                    <div className="popover-body">
                      <ul className="list-group">
                        {notifications.map((notification, index) => (
                          <li key={index} className="list-group-item">
                            Recibiste {notification.amount} de {notification.from_username}.
                            <br />
                            En concepto de: {notification.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/groups"
                className={`nav-item nav-link nav-fill ${location.pathname === "/groups" && !showNotifications ? "active" : ""}`}
              >
                Grupos
              </Link>
              <Link
                to="/transactions"
                className={`nav-item nav-link ${location.pathname === "/transactions" && !showNotifications ? "active" : ""}`}
              >
                Transacciones
              </Link>
              <Link
                to="/deudas"
                className={`nav-item nav-link ${location.pathname === "/deudas" && !showNotifications ? "active" : ""}`}
              >
                Deudas
              </Link>
              <Link
                to="/"
                onClick={handleLogout}
                className={`nav-item nav-link ${location.pathname === "/" ? "active" : ""}`}
              > 
                <FontAwesomeIcon icon={faRightFromBracket} />
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




