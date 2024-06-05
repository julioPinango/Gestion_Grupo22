import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import imagen1 from "../img/Img1.jpg";
import imagen2 from "../img/Img2.jpg";
import imagen3 from "../img/Img3.jpg";
import imagen4 from "../img/Img4.jpg";
import imagen5 from "../img/Img5.jpg";
import imagen6 from "../img/Img6.jpg";

function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`Home d-flex flex-column min-vh-100 ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="main-content flex-grow-1">
        <div id="carouselExampleInterval" className="carousel carousel-dark slide" data-bs-ride="carousel">
        <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="5000">
              <div className="carousel-caption d-none d-md-block">
                <h5>WELCOME TO BILLBUDDY</h5>
                <p>(better than Splitw...)</p>
              </div>
              <img src={imagen1} className="d-block w-100 img-fluid" alt="Imagen 1" />
              <div className="carousel-caption d-none d-md-block">
                <h5>WELCOME TO BILLBUDDY</h5>
                <p>(better than Splitw...)</p>
              </div>
            </div>
            { /* Repetir para las demás imágenes */ }
            <div className="carousel-item" data-bs-interval="5000">
              <img src={imagen2} className="d-block w-100 img-fluid" alt="Imagen 2" />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="5000">
              <img src={imagen3} className="d-block w-100 img-fluid" alt="Imagen 3" />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="5000">
              <img src={imagen4} className="d-block w-100 img-fluid" alt="Imagen 4" />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="5000">
              <img src={imagen5} className="d-block w-100 img-fluid" alt="Imagen 5" />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
            </div>
            <div className="carousel-item" data-bs-interval="5000">
              <img src={imagen6} className="d-block w-100 img-fluid" alt="Imagen 6" />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

