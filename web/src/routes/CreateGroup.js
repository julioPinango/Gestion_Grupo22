import React from "react";
import UserList from '../components/UsersList';
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'; 

function CreateGroup() {
  return (
    <div className="Home"> {}
       <div>
            <Header href='/dashboard'/>
        </div>
        <body>
            <h2 className="body">Seleccionar usuarios para grupo</h2>
            <UserList />
        </body>
        <div>
            <Footer/>
        </div>
    </div>
  );
}


export default CreateGroup;