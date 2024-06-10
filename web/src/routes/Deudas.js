import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3001/transactions/debtor', {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt-token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      const filteredTransactions = data.Transactions.filter(transaction => transaction.amount > 0);
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const cancelDebt = async (group_id, payer, amount, transaction_id) => {
    try {
      const response = await fetch(
        'http://localhost:3001/transactions/canceldebt',
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({
            group_id,
            payer,
            amount,
            transaction_id
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      // Actualizar el monto de la transacción a 0 en el estado local
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === transaction_id) {
          return { ...transaction, amount: 0 };
        }
        return transaction;
      });

      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error editando la transacción:", error.message);
      alert("No se pudo editar la transacción: " + error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="table-responsive mt-5" >
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Monto</th>
                <th scope="col">Descripción</th>
                <th scope="col">Prestador</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.payer}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => cancelDebt(transaction.group_id, transaction.payer, transaction.amount, transaction.id)}
                    >
                      Saldar deuda
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <h1>No hay transacciones pendientes de pago</h1>
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

export default Deudas;

