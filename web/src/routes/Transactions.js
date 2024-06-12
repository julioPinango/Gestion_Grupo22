import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import FacturaPDF from './FacturaPDF'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const params = useParams();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const recurrenceOptions = ["Única vez", "Semanal", "Mensual"];

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/transactions/payer',
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
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [params.id]);

  const editTransaction = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/transactions/${selectedTransactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({
            description: newDescription,
            selectedDate: selectedDate,
            recurrence: recurrence,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      setIsModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error editing transaction:", error.message);
      alert("Unable to edit transaction: " + error.message);
    }
  };

  const handleOpenModal = async (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);

    // Obtener los detalles de la transacción seleccionada
    const selectedTransaction = transactions.find(transaction => transaction.id === transactionId);
    setNewDescription(selectedTransaction.description);
    setRecurrence(selectedTransaction.recurrence);
    setSelectedDate(selectedTransaction.selecteddate);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    setNewDescription(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRecurrenceChange = (event) => {
    setRecurrence(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedTransactionId) {
      alert("No transaction selected for editing.");
      return;
    }
    await editTransaction();
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
    <div className={`Dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div className="table-responsive mt-5">
        <table className="table table-dark table table-striped table-bordered table-responsive">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Monto</th>
              <th scope="col">Descripción</th>
              <th scope="col">De</th>
              <th scope="col">Hacia</th>
              <th scope="col">Acciones</th>
              <th scope="col">Factura</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.from_username}</td>
                  <td>{transaction.to_username}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleOpenModal(transaction.id)}
                    >
                      Editar transacción
                    </button>
                  </td>
                  <td> 
                    <div>
                      <PDFDownloadLink
                        document={<FacturaPDF 
                          payer={transaction.payer} 
                          amount={transaction.amount} 
                          description={transaction.description} 
                          date={transaction.selecteddate} 
                        />}
                        fileName="transactions.pdf"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </PDFDownloadLink>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <div className="mt-5">
                    <h1>No hay transacciones aún</h1>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions && transactions.length > 0 && (
        <div>
          <PDFDownloadLink
            document={<DocuPDF transactions={transactions} />}
            fileName="transactions.pdf"
          >
            <button className="btn btn-info">
              Descargar transacciones en formato PDF
            </button>
          </PDFDownloadLink>
        </div>
      )}

      {/* Modal para editar la descripción de la transacción */}
      {isModalOpen && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar transacción</h5>
              </div>
              <div className="modal-body">
                <label htmlFor="newDescription">Nueva descripción:</label>
                <input
                  type="text"
                  id="newDescription"
                  className="form-control text-center"
                  value={newDescription}
                  onChange={handleInputChange}
                />
                <label htmlFor="selectedDate">Fecha seleccionada:</label>
                <DatePicker
                  id="selectedDate"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control text-center"
                />
                <label htmlFor="recurrence">Recurrencia:</label>
                <select
                  id="recurrence"
                  className="form-control text-center"
                  value={recurrence}
                  onChange={handleRecurrenceChange}
                >
                  {recurrenceOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

