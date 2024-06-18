import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DocuPDF from "./DocuPDF";
import "./Deudas.css";

const Deudas = () => {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [filterState, setFilterState] = useState("Todas"); // Estado inicial: Todas las transacciones
  const [debtInfo, setDebtInfo] = useState({
    payer: "",
    group_id: 0,
    description: "",
    transactionId: 0,
    amount: 0,
    partialAmount: 0
  });

  useEffect(() => {
    const fetchTransactionsByCategory = async () => {
      try {
        let debtorTransactions = [];

        if (category === null) {
          // Si la categoría es null, obtener todas las transacciones sin filtrar por categoría
          const debtorResponse = await fetch("http://localhost:3001/transactions/debtor", {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          });

          if (!debtorResponse.ok) {
            throw new Error("Failed to fetch transactions");
          }

          const debtorData = await debtorResponse.json();

          debtorTransactions = debtorData.Transactions;
        } else {
          // Si la categoría no es null, obtener transacciones filtradas por categoría
          const debtorResponse = await fetch(`http://localhost:3001/transactions/debtor?category=${category}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt-token"),
            },
          });

          if (!debtorResponse.ok) {
            throw new Error("Failed to fetch transactions");
          }

          const debtorData = await debtorResponse.json();

          debtorTransactions = debtorData.Transactions;
        }

        // Agregar campo 'state' a cada transacción basado en 'amount' y 'paid'
        const transactionsWithState = debtorTransactions.map(transaction => ({
          ...transaction,
          state: transaction.amount === transaction.paid ? "Pagada" : "Impaga"
        }));

        setTransactions(transactionsWithState);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactionsByCategory();
  }, [category]);

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

      // Agregar campo 'state' a cada transacción basado en 'amount' y 'paid'
      const transactionsWithState = data.Transactions.map(transaction => ({
        ...transaction,
        state: transaction.amount === transaction.paid ? "Pagada" : "Impaga"
      }));

      setTransactions(transactionsWithState);
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
  
      // Actualizar el estado local de transactions después del pago
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === transactionId) {
          const newPaid = transaction.paid + parseFloat(partialAmount); // Sumar el monto parcial pagado al 'paid' actual
          const newState = transaction.amount === newPaid ? "Pagada" : "Impaga"; // Actualizar el estado
  
          return {
            ...transaction,
            paid: newPaid,
            state: newState
          };
        }
        return transaction;
      });
  
      setTransactions(updatedTransactions);
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

  // Función para filtrar las transacciones según el estado
  const filteredTransactions = transactions.filter(transaction => {
    if (filterState === "Todas") {
      return true; // Mostrar todas las transacciones
    } else if (filterState === "Pagadas") {
      return transaction.state === "Pagada"; // Mostrar solo las transacciones pagadas
    } else if (filterState === "Impagas") {
      return transaction.state === "Impaga"; // Mostrar solo las transacciones impagas
    }
    return true;
  });

  return (
    <div className={`Deudas ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
      <div className="mt-3">
        <label htmlFor="filterState" className="mr-2">Filtrar por estado:</label>
        <select
          className="form-select"
          id="filterState"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
        >
          <option value="Todas">Todas</option>
          <option value="Pagadas">Pagadas</option>
          <option value="Impagas">Impagas</option>
        </select>
      </div>
      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="table-responsive mt-5">
          <table className="table table-dark table table-striped table-bordered table-responsive">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Monto</th>
                <th scope="col">Descripción</th>
                <th scope="col">Prestador</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{transaction.amount - transaction.paid}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.payer}</td>
                  <td>
                    {transaction.state === "Pagada" ? (
                      <PDFDownloadLink
                        document={<DocuPDF transaction={transaction} />}
                        fileName={`comprobante_pago_${transaction.id}.pdf`}
                      >
                        {({ loading }) => (loading ? "Cargando..." : "Descargar comprobante de pago")}
                      </PDFDownloadLink>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleModalOpen(transaction)}
                      >
                        Saldar deuda
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <h1>No hay transacciones según el filtro seleccionado</h1>
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
      <Footer/>
    </div>
  );
};

export default Deudas;


