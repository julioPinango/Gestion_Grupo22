import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocuPDF from "./DocuPDF";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      {" "}
      {}
      <div>
        <Header href="/" />
      </div>
      <body>
        <div class="container text-center mt-5">
          <h2 className="body">Welcome to BillBuddy</h2>
          <p>(better than Splitw...)</p>

          <div class="row align-items-start">
            <div class="col border-bottom">
              
              <Link
                to="/login"
                className="btn btn-primary"
              >
                Ingresar
              </Link>
            </div>
            <div class="col border-bottom">
            <Link
                to="/register"
                className="btn btn-primary"
              >
                Registrarme
              </Link>
            </div>
          </div>
        </div>
      </body>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
