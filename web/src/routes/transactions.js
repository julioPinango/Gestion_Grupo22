import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/groups/${params.id}/transactions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          }
        );

        const data = await response.json();
        setTransactions(data.Transactions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTransactions();
  }, [params.id]);

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
              <th scope="col">Monto</th>
              <th scope="col">De</th>
              <th scope="col">Hacia</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <th scope="row">{index}</th>
                <td>{transaction.amount}</td>
                <td>{transaction.from_username}</td>
                <td>{transaction.to_username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
    <PDFDownloadLink document={<DocuPDF />} fileName="somename.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download now!'
      }
    </PDFDownloadLink>
  </div>
    </div>
  );
};

export default Transactions;

