import React from "react";
import { Link } from 'react-router-dom';
import './Home.css'; 
import Header from '../components/Header'
import Footer from '../components/Footer'

function Dashboard() {
  return (
    <div className="Home"> {}
        <div>
            <Header/>
        </div>
        <body className="container text-center mt-5">
            <h2 className="body">Welcome to the BillBuddy</h2>
            <a href="/group/create" class="btn btn-primary mt-5">Crear grupo</a>
        </body>
        <div>
            <Footer/>
        </div>
    </div>
  );
}


export default Dashboard;
