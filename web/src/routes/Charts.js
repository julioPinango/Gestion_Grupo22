import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./MyTransactions.css";

const Charts = () => {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const categoryMap = {
    1: "Gasto general",
    2: "Recreación",
    3: "Servicio",
    4: "Transporte"
  };

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
    const calculateCategoryData = () => {
      const categoryCounts = {};
      transactions.forEach(transaction => {
        const category = transaction.category;
        categoryCounts[categoryMap[category]] = (categoryCounts[categoryMap[category]] || 0) + 1;
      });
      const data = Object.entries(categoryCounts).map(([category, count]) => [category, count]);
      setCategoryData([["Categoría", "Cantidad de operaciones"], ...data]);
    };

    calculateCategoryData();
  }, [transactions]);

  useEffect(() => {
    const calculateMonthlyData = () => {
      const monthlyCounts = {};
      transactions.forEach(transaction => {
        const date = new Date(transaction.selecteddate);
        if (!isNaN(date.getTime())) {
          const month = date.getMonth(); // Obtener el mes (0-11)
          const year = date.getFullYear();
          const label = `${year}-${month + 1}`; // Construir una cadena única para representar el mes y el año
          monthlyCounts[label] = (monthlyCounts[label] || 0) + 1;
        }
      });
      const data = Object.entries(monthlyCounts).map(([month, count]) => [month, count]);
      setMonthlyData([["Mes", "Cantidad de operaciones"], ...data]);
    };

    calculateMonthlyData();
  }, [transactions]);

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
    <div className={`MyTransactions ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="mt-3">
        {/* Tu código para el botón y el selector de categoría aquí... */}
      </div>
      {categoryData && categoryData.length > 0 && (
        <div className="charts-container">
          <div className="pie-chart">
            <Chart
              chartType="PieChart"
              width="90%"
              height="400px"
              data={categoryData}
              options={{
                title: "Operaciones por categoría",
                pieHole: 0.4,
                is3D: true,
              }}
            />
          </div>
          <div className="space"></div>
          <div className="bar-chart">
            <Chart
              chartType="ColumnChart"
              width="90%"
              height="400px"
              data={monthlyData}
              options={{
                title: "Operaciones por mes",
                hAxis: {
                  title: "Mes",
                },
                vAxis: {
                  title: "Cantidad de operaciones",
                },
              }}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Charts;
