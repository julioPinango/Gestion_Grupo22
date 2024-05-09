import React from 'react';

const Header = ({ href }) => {
  return (
    <header className="bg-dark text-light py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">
            <a href={href} className="text-light text-decoration-none">BillBuddy</a>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;