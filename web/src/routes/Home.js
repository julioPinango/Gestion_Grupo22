import React from "react";
import { Link } from 'react-router-dom';
import './Home.css'; 

function Home() {
  return (
    <div className="Home"> 
      <header className="header"> 
        <h1 className="title">BillBuddy</h1> 
      </header>
      <main>
        <h2 className="body">Welcome to the Home Page</h2>
        <Link to="/login">Login</Link>
      </main>
      <footer className="footer"> 
        <p>BillBuddy 2024</p>
      </footer>
    </div>
  );
}

export default Home;

