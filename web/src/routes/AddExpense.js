import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "./Home.css";
import { useParams } from "react-router-dom";

function AddExpense() {
  const [expenses, setExpenses] = useState(0);
  const [description, setDescription] = useState("");
  const params = useParams();

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/groups/${params.id}/balances`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt-token')
        },
        body: JSON.stringify({ expenses, description }),
      });

      {/*if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    */}
      window.location.href = `/groups/${params.id}`;
    } catch (error) {
      console.error("Failed to add expense:", error.message);
      alert("Failed to add expense: " + error.message);
    }
  };

  return (
    <div className="Home">
      {" "}
      {}
      <div>
        <Header href="/dashboard" />
      </div>
      <body>
        <div class="container text-center mt-5">
          <form onSubmit={handleAddExpense}>
            <h2 className="body">Agregar gasto</h2>

            <div class="input-group mb-3 mt-5">
              <span class="input-group-text">$ (ARS)</span>
              <input
                type="number"
                class="form-control"
                placeholder="Monto"
                aria-label="Monto"
                onChange={(e) => setExpenses(e.target.value)}
              ></input>
            </div>

            <div class="mb-3 mt-5">
              <p class="text-start">Descripción</p>
              <textarea
                class="form-control"
                rows="10"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <Button text="Agregar" />
          </form>
        </div>
      </body>
     {/* <div> <Footer /> </div> */}
    </div>
  );
}

export default AddExpense;
