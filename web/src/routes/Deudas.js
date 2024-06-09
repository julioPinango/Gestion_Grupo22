import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DocuPDF from "./DocuPDF";
import "./Deudas.css";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

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
        setTransactions(data.Transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <div className={`Deudas ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mt-5 text-center">
        {transactions && transactions.length > 0 ? (
          <div className="table-responsive mt-5">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Grupo</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">De</th>
                  <th scope="col">Hacia</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{transaction.group_id}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.from_username}</td>
                    <td>{transaction.to_username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
            <h1>No hay transacciones aún</h1>
          </div>
        )}

        {transactions && transactions.length > 0 && (
          <div className="mt-4">
            <PDFDownloadLink
              document={<DocuPDF transactions={transactions} />}
              fileName="transactions.pdf"
            >
              <button className="btn btn-info">Descargar transacciones en formato PDF</button>
            </PDFDownloadLink>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Deudas;
