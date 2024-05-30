import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);

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

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>

      {transactions && transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <div className="table-responsive mt-5" key={index}>
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
                <tr>
                  <th scope="row">{index}</th>
                  <td>{transaction.group_id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.from_username}</td>
                  <td>{transaction.to_username}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
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

export default Deudas;