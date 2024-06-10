import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import CreateGroup from "./routes/CreateGroup";
import EditGroup from "./routes/EditGroup";
import Group from "./routes/Group";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import UserList from "./components/UsersList";
import Transactions from "./routes/Transactions";
import Deudas from "./routes/Deudas";
import EditTransaction from "./routes/EditTransaction";
import MyTransactions from "./routes/MyTransactions";
import Recordatorios from "./routes/Recordatorios";
import Profile from "./routes/Profile";

const getAccessToken = () =>{
  return localStorage.getItem('jwt-token')
}

const isAuthenticated = () => {
  return !!getAccessToken();
}

const ProtectedRoute = ({isAuthenticated}) => {
  if(!isAuthenticated){
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
    children:[
      {
        path: "/groups",
        element: <Dashboard />,
      },
      {
        path: "/group/create",
        element: <CreateGroup />,
      },
      {
        path: "/groups/:id/edit",
        element: <EditGroup />,
      },
      {
        path: "/groups/add/:id",
        element: <UserList />,
      },
      {
        path: "/groups/:id",
        element: <Group />,
      },
      {
        path: "/groups/:id/transactions",
        element: <Transactions />,
      },
      {
        path: "/transactions",
        element: <MyTransactions />,
      },
      {
        path: "/deudas",
        element: <Deudas />,
      },
      {
        path: "/recordatorios",
        element: <Recordatorios />,
      },
      {
        path: "/groups/:id/transactions/:transaction_id",
        element: <EditTransaction />,
      },
      {
        path: "/profile",
        element: <Profile />,
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

