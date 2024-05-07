import React from 'react';

const Header = () => {
  return (
    <header className="bg-dark text-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">BillBuddy</h1>
          <nav>
            <ul className="list-inline m-0">
              <li className="list-inline-item"><a href='/'>Home</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;