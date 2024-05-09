import React from 'react';

const Button = ({ text }) => {
  return (
    <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">{text}</button>
    </div>
  );
};

export default Button;
