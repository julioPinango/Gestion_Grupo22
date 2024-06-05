import React, {useState, useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRight, faCalendarDays } from "@fortawesome/free-solid-svg-icons"; // Importar faCalendarDays
import { faArrowRight, faBell } from "@fortawesome/free-solid-svg-icons";


const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("jwt-token");


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


  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
  };

  const location = useLocation();

  return (
    <header className="bg-dark text-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between">
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


              <div className="container"></div>
                <div>
                  <Link
                    className={`nav-item nav-link ${showNotifications ? "active" : ""}`}
                    
                    onClick={() => {
                      setShowNotifications(prevShowNotifications => !prevShowNotifications);
                      if (showNotifications) {
                        setNotifications([]); 
                      }
                      }}
                    > 
                  
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <FontAwesomeIcon icon={faBell} style={{ color: "white" }} />
                      {notifications.length != 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                          <span className="visually-hidden">New alerts</span>
                        </span>
                      )}
                    </div>

                  </Link>
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
                className={`nav-item nav-link ${
                  location.pathname === "/groups" && !showNotifications ? "active" : ""
                }`}
              >
                Grupos
              </Link>
              <Link
                to="/transactions"
                className={`nav-item nav-link ${
                  location.pathname === "/transactions" && !showNotifications ? "active" : ""
                }`}
              >
                Transacciones
              </Link>
              <Link
                to="/deudas"
                className={`nav-item nav-link ${
                  location.pathname === "/deudas" && !showNotifications ? "active" : ""
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
