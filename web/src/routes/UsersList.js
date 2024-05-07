import React, { useState, useEffect } from 'react';
import './Home.css'; 


const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (

    <div className="Home"> 
        <header className="header"> 
            <h1 className="title">BillBuddy</h1> 
        </header>
        <main>
            <div class="container text-center">
                <h2>Lista de usuarios</h2>
            </div>
            <div class="container text-center">
                <div class="row align-items-start">
                    <div class="col border-bottom">
                        Nombre
                    </div>
                    <div class="col border-bottom">
                      Apellido
                    </div>
                    <div class="col border-bottom">
                      Username
                    </div>
                    <hr />
                    
                    {users.map((user, index) => (
                        <div className="row" key={index}>
                            <div className="col border-left border-bottom">{user.name}</div>
                            <div className="col border-bottom">{user.lastname}</div>
                            <div className="col border-bottom">{user.username}</div>
                        </div>
                    ))}
                </div>

            </div>

        </main>
      <footer className="footer"> 
        <p>BillBuddy 2024</p>
      </footer>
    </div>
    
  );
};

export default UserList;
