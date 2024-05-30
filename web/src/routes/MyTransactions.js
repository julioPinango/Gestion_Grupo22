import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const MyTransactions = () => {

  const [transactions, setTransactions] = useState([]);

  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:3001/transactions", {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setTransactions(data.Transactions);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>
      
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

      <div>
      <PDFDownloadLink
        document={<DocuPDF transactions={transactions} />}
        fileName="transactions.pdf"
      >
        <button variant="info">Descargar PDF</button>
      </PDFDownloadLink>
  </div>
    </div>
  );
};

export default MyTransactions;
