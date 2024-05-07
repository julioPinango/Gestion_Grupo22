import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

  
    <body>
        <div class="container text-center mt-4">
            <h2>Lista de usuarios</h2>
        </div>
        
        <div class="container text-center">
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Nombre usuario" aria-label="Nombre usuario" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}></input>
            </div>

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
                <div class="col border-bottom">
                  Seleccionar
                </div>

                <hr />
                
                {filteredUsers.map((user, index) => (
                    <div className="row" key={index}>
                        <div className="col border-left border-bottom">{user.name}</div>
                        <div className="col border-bottom">{user.lastname}</div>
                        <div className="col border-bottom">{user.username}</div>
                        <div className="col border-bottom"><input type="checkbox"/></div>
                    </div>
                ))}
            </div>

        <div className="container text-right mt-5">
          <div className="d-flex justify-content-end">
            <button className="button">Crear grupo</button>
          </div>
        </div>
              
        </div>
    </body>
     
   
    
  );
};

export default UserList;
