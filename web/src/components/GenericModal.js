import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import "./Home.css";
import { useParams } from "react-router-dom";

function AddExpense() {
  const [amount, setAmount] = useState(0);
  const [receivers, setReceivers] = useState([]);
  const params = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/groups/${params.id}/members`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }
        );

        const data = await response.json();
        setUsers(data.Groups);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGroup();
  }, [params.id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/groups/${params.id}/transactions`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('jwt-token')
        },
        body: JSON.stringify({ amount, receivers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      window.location.href = `/groups/${params.id}`;
    } catch (error) {
      console.error("Failed to add expense:", error.message);
      alert("Failed to add expense: " + error.message);
    }
  };

  return (
    <div className="Home">
      <Header href={`/groups/${params.id}`} />
      <div className="container mt-5">
        <form onSubmit={handleAddExpense}>
          <h2 className="body">Agregar gasto</h2>
          <div className="mb-3 mt-5">
            <span className="input-group-text">$ (ARS)</span>
            <input
              type="number"
              className="form-control"
              placeholder="Monto"
              aria-label="Monto"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-3 mt-5">
            {users.map((user1, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`customCheck${index}`}
                  onChange={() => {
                    const newReceivers = [...receivers];
                    const indexInReceivers = newReceivers.indexOf(user1.username);
                    if (indexInReceivers === -1) {
                      newReceivers.push(user1.username);
                    } else {
                      newReceivers.splice(indexInReceivers, 1);
                    }
                    setReceivers(newReceivers);
                  }}
                />
                <label className="form-check-label" htmlFor={`customCheck${index}`}>
                  {user1.username}
                </label>
              </div>
            ))}
          </div>
          <Button text="Agregar" />
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
