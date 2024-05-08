import React from "react";
import './Home.css'; 
import Header from '../components/Header'
import Footer from '../components/Footer'

function Dashboard() {
  return (
    <div className="Home"> {}
        <div>
            <Header href='/dashboard'/>
        </div>
        <body className="container mt-5">

          <h2 className="body text-center">Welcome to BillBuddy</h2>
          <h3 className="body text-center mt-5">Mis grupos</h3>

          <div class="container text-left">

            <div class="list-group mt-5">
              <a href="#" class="list-group-item list-group-item-action">Familia</a>
              <a href="#" class="list-group-item list-group-item-action">Vacaciones</a>
              <a href="#" class="list-group-item list-group-item-action">Salidas</a>
              <a href="#" class="list-group-item list-group-item-action">F5</a>
            </div>

            <div className="d-flex justify-content-end mt-5">
              <a href="/group/create" class="btn btn-primary">Crear grupo</a>
            </div>

          </div>
           
        </body>

        <div>
            <Footer/>
        </div>
    </div>
  );
}


export default Dashboard;
