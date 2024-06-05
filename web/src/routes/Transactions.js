import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Header from "../components/Header";
import DocuPDF from "./DocuPDF";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const params = useParams();

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
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [params.id]);

  const editTransaction = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/groups/${params.id}/transactions/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt-token"),
          },
          body: JSON.stringify({
            description: newGroupName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
      setIsModalOpen(false);
      // Actualizar la lista de transacciones después de editar
      fetchTransactions();
    } catch (error) {
      
      console.error("Error editando la transacción:", error.message);
      alert("No se pudo editar la transacción: " + error.message);
    }
  };

  const handleOpenModal = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    setNewGroupName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedTransactionId) {
      alert("No se ha seleccionado ninguna transacción para editar.");
      return;
    }
    await editTransaction();
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
                <th scope="col">De</th>
                <th scope="col">Hacia</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.from_username}</td>
                  <td>{transaction.to_username}</td>
                  <td>
                   {/*} <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleOpenModal(transaction.id)}
                    >
                      Editar transacción
                    </button>
              */}
              <Link to={`/groups/${params.id}/transactions/${transaction.id}`} style={{ padding: "0 10px" }}>
              <button
                      type="button"
                      className="btn btn-primary"
                    >
                      Editar transacción
                    </button>
            </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5">
          <h1>No hay transacciones aún</h1>
        </div>
      )}

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

      {/* Modal para editar la descripción del grupo */}
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
                <h5 className="modal-title">Editar descripción del grupo</h5>
              </div>
              <div className="modal-body">
                <label htmlFor="newGroupName">Nueva descripción del grupo:</label>
                <input
                  type="text"
                  id="newGroupName"
                  className="form-control"
                  value={newGroupName}
                  onChange={handleInputChange}
                />
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



