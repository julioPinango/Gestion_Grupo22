import React from "react";
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
  return (
    <div className="Home d-flex flex-column min-vh-100">
      <Header />
      <div className="main-content flex-grow-1">
        <div className="container text-center mt-5">
          <h2 className="title">Welcome to BillBuddy</h2>
          <p className="subtitle">(better than Splitw...)</p>

          <div id="carouselExampleInterval" className="carousel slide custom-carousel" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval="2000">
                <img src={imagen1} className="d-block w-100 img-fluid" alt="Imagen 1" />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagen2} className="d-block w-100 img-fluid" alt="Imagen 2" />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagen3} className="d-block w-100 img-fluid" alt="Imagen 3" />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagen4} className="d-block w-100 img-fluid" alt="Imagen 4" />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagen5} className="d-block w-100 img-fluid" alt="Imagen 5" />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagen6} className="d-block w-100 img-fluid" alt="Imagen 6" />
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
      </div>
      <Footer />
    </div>
  );
}

export default Home;


