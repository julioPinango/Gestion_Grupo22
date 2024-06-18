import React, { useState, useEffect } from "react";

// Función para formatear la fecha
const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth() + 1;
  const year = dateObject.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const Recordatorios = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3001/transactions/debtor", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log(data.Transactions);
        const sortedTransactions = data.Transactions.sort((a, b) => new Date(a.selecteddate) - new Date(b.selecteddate));
        const today = new Date().toISOString().split('T')[0]; // Obtenemos la fecha actual en formato YYYY-MM-DD
        const filteredTransactions = sortedTransactions.filter(transaction => transaction.selecteddate.split('T')[0] >= today); // Filtrar transacciones con fecha igual o posterior a hoy
        setTransactions(filteredTransactions);
        setCurrentDate(today);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        
      }
    };

    fetchTransactions();
  }, []);

  return (
    
        <div className="text-center">

        {transactions && transactions.length > 0 ? (
          <ul className="list-group list-group-flush">
            {transactions.map((transaction, index) => (
               <li
               className={`list-group-item ${transaction.selecteddate.split('T')[0] === currentDate ? 'bg-danger text-light' : ''}`}
               key={index}
              >
                <strong>Grupo:</strong> {transaction.group_id}<br />
                <strong>Monto:</strong> {transaction.amount}<br />
                <strong>Descripción:</strong> {transaction.description}<br />
                <strong>Fecha:</strong> {formatDate(transaction.selecteddate)}<br />
              </li>
            ))}
          </ul>
          ) : (
            <p>No hay transacciones para mostrar</p>
        )}

        </div>
  );
};

export default Recordatorios;

