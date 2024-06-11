import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [debtorResponse, payerResponse] = await Promise.all([
          fetch("http://localhost:3001/transactions/debtor", {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }),
          fetch("http://localhost:3001/transactions/payer", {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }),
        ]);

        if (!debtorResponse.ok || !payerResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const [debtorData, payerData] = await Promise.all([
          debtorResponse.json(),
          payerResponse.json(),
        ]);

        const combinedTransactions = [...debtorData.Transactions, ...payerData.Transactions];
        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTransactionsByCategory = async () => {
      try {
        let debtorTransactions = [];
        let payerTransactions = [];

        if (category !== null) {
          const [debtorResponse, payerResponse] = await Promise.all([
            fetch(`http://localhost:3001/transactions/debtor?category=${category}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt-token"),
              },
            }),
            fetch(`http://localhost:3001/transactions/payer?category=${category}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt-token"),
              },
            }),
          ]);

          if (debtorResponse.ok) {
            const debtorData = await debtorResponse.json();
            debtorTransactions = debtorData.Transactions;
          }

          if (payerResponse.ok) {
            const payerData = await payerResponse.json();
            payerTransactions = payerData.Transactions;
          }
        }

        const combinedTransactions = [...debtorTransactions, ...payerTransactions];
        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactionsByCategory();
  }, [category]);

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>
      <div className="mt-3">
        <button className="btn btn-primary mr-2">Filtrar por categoría</button>
        <select
          className="form-select"
          id="category"
          value={category === null ? "Todas las categorías" : category}
          onChange={(e) => setCategory(e.target.value === "Todas las categorías" ? null : e.target.value)}
        >
          <option value={null}>Todas las categorías</option>
          <option value={1}>Gasto general</option>
          <option value={2}>Recreación</option>
          <option value={3}>Servicio</option>
          <option value={4}>Transporte</option>
        </select>
      </div>
      {transactions && transactions.length > 0 ? (
        <div className="table-responsive mt-5">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Grupo</th>
                <th scope="col">Monto</th>
                <th scope="col">Descripción</th>
                <th scope="col">Prestador</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{transaction.group_id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.payer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <h1>No hay transacciones aún</h1>
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

export default MyTransactions;
