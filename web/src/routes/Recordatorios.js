import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

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
        const response = await fetch("http://localhost:3001/mytransactions", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
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
      <div>
        <Header href="/groups" />
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="mt-5">
          <h2>Próximos gastos</h2>
          <ul className="list-group list-group-flush">
            {transactions.map((transaction, index) => (
              <li className={`list-group-item ${transaction.selecteddate.split('T')[0] === currentDate ? 'bg-danger text-light' : ''}`} key={index}>
                <strong>Grupo:</strong> {transaction.group_id}<br />
                <strong>Monto:</strong> {transaction.amount}<br />
                <strong>Descripción:</strong> {transaction.description}<br />
                <strong>Fecha:</strong> {formatDate(transaction.selecteddate)}<br />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <h1>No hay transacciones para mostrar</h1>
        </div>
      )}

      {transactions && transactions.length > 0 && (
        <div>
          <PDFDownloadLink
            document={<DocuPDF transactions={transactions} />}
            fileName="transactions.pdf"
          >
            <button className="btn btn-info">Descargar transacciones en formato PDF</button>
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default Recordatorios;

