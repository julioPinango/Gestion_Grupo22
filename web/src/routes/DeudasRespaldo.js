import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [debtInfo, setDebtInfo] = useState({
    payer: "",
    amount: 0,
    description: "",
    transactionId: 0
  });

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
      setTransactions(data.Transactions.filter(transaction => transaction.amount > 0));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const cancelDebt = async () => {
    try {
      const { group_id, payer, amount, transactionId } = debtInfo;

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
            transaction_id: transactionId
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      // Actualizar el estado local para reflejar el cambio
      setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      setShowModal(false);
    } catch (error) {
      console.error("Error editando la transacción:", error.message);
      alert("No se pudo editar la transacción: " + error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleModalOpen = (transaction) => {
    setDebtInfo({
      payer: transaction.payer,
      amount: transaction.amount,
      description: transaction.description,
      transactionId: transaction.id
    });
    setShowModal(true);
  };

  return (
    <div className="text-center">
      <div>
        <Header href="/groups" />
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="table-responsive mt-5">
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
                      onClick={() => handleModalOpen(transaction)}
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
          <h1>No hay transacciones aún</h1>
        </div>
      )}

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Pago</h5>
                
              </div>
              <div className="modal-body">
                <p>¿Estás seguro que deseas pagarle {debtInfo.amount} por {debtInfo.description} a {debtInfo.payer}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={cancelDebt}>Confirmar Pago</button>
              </div>
            </div>
          </div>
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