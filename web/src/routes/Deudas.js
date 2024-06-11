import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showModal, setShowModal] = useState(false);
  const [debtInfo, setDebtInfo] = useState({
    payer: "",
    group_id: 0,
    description: "",
    transactionId: 0,
    amount:0,
    partialAmount: 0
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
      const { group_id, payer, transactionId, partialAmount } = debtInfo;

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
            amount: partialAmount,
            transaction_id: transactionId
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      setShowModal(false);
    } catch (error) {
      const { group_id, payer, transactionId, partialAmount } = debtInfo;
        console.log(group_id, payer, transactionId, partialAmount);
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
      transactionId: transaction.id,
      group_id: transaction.group_id,
      partialAmount: 0
    });
    setShowModal(true);
  };

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
      <div>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
                <p>¿Cuánto deseas pagar de los {debtInfo.amount} por {debtInfo.description} a {debtInfo.payer}?</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ingrese el monto"
                  value={debtInfo.partialAmount}
                  onChange={(e) => setDebtInfo({ ...debtInfo, partialAmount: e.target.value })}
                />
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