import React from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'; 

function Home() {
  return (
    <div className="Home"> {}
      <div>
        <Header/>
      </div>
      <main>
        <h2 className="body">Welcome to the Home Page</h2>
        <div class="container text-center mt-5">
          <a href="/login" class="btn btn-primary">Login</a>
        </div>
      </main>
      <div>
        <Footer/>
      </div>
    </div>
  );
}

export default Home;

