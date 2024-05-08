import React from "react";
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'; 

function Home() {
  return (
    <div className="Home"> {}
      <div>
        <Header href='/'/>
      </div>

      <body>


        <div class="container text-center mt-5">

          <h2 className="body">Welcome to BillBuddy</h2>
          <p>(better than Splitw...)</p>

          <div class="row align-items-start">

            <div class="col border-bottom">
              <a href="/login" class="btn btn-primary">Ingresar</a>
            </div>
            <div class="col border-bottom">
              <a href="/register" class="btn btn-primary">Registrarme</a>
            </div>

          </div>

        </div>

      </body>

      <div>
        <Footer/>
      </div>
    </div>
  );
}

export default Home;

